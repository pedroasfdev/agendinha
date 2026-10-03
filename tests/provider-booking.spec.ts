import { expect, test } from '@playwright/test';

test('all seven new screens fit mobile and desktop without runtime errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const route of [
    '/prestador/servicos',
    '/prestador/pagina',
    '/prestador/agenda',
    '/prestador/pagamentos',
    '/agendamento/studio-marina/horario?servico=gel',
    '/agendamento/studio-marina/pagamento?servico=gel&data=2026-10-17&horario=10:30',
    '/confirmacao/demo-appointment',
  ]) {
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await expect
      .poll(() =>
        page
          .locator('img')
          .evaluateAll((images) =>
            images.every((image) => image.complete && image.naturalWidth > 0),
          ),
      )
      .toBe(true);
  }
  expect(errors).toEqual([]);
});

test('provider can manage, add and order the services shown to clients', async ({ page }) => {
  await page.goto('/perfil');
  await page.getByRole('link', { name: 'Acessar área do prestador' }).click();
  await page.getByRole('switch', { name: 'Ativar Manicure em gel', exact: true }).uncheck();
  await page.getByRole('button', { name: 'Editar Manicure tradicional', exact: true }).click();
  await page.getByLabel('Preço (R$)').fill('65');
  await page.getByRole('button', { name: 'Salvar serviço' }).click();
  await page.getByRole('button', { name: 'Adicionar novo serviço' }).click();
  await page.getByLabel('Nome do serviço', { exact: true }).fill('Esmaltação especial');
  await page.getByLabel('Descrição do serviço', { exact: true }).fill('Acabamento personalizado');
  await page.getByLabel('Preço (R$)').fill('70');
  await page.getByLabel('Duração (minutos)').fill('45');
  await page.getByRole('button', { name: 'Salvar serviço' }).click();
  await expect(page.locator('.provider-stats').first()).toContainText('3');
  await page.getByRole('button', { name: 'Ordenar', exact: true }).click();
  await page
    .getByRole('button', { name: 'Mover Esmaltação especial para cima', exact: true })
    .click();
  await expect(page.locator('.provider-service-name').nth(3)).toContainText('Esmaltação especial');
  await page.getByRole('link', { name: 'Visualizar', exact: true }).click();
  await expect(page.getByRole('radio', { name: /Manicure em gel/ })).toHaveCount(0);
  await expect(page.getByRole('radio', { name: /Manicure tradicional.*R\$ 65/ })).toBeVisible();
  await expect(page.getByRole('radio', { name: /Esmaltação especial/ })).toBeVisible();
});

test('editing the page validates hours and updates the published preview', async ({ page }) => {
  await page.goto('/prestador/pagina');
  await page.getByLabel('Nome da página').fill('Studio Ana');
  await page.getByLabel('Local de atendimento').fill('Rua Nova, 50 · Pinheiros');
  await page.getByLabel('Abertura', { exact: true }).fill('20:00');
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(page.getByRole('alert')).toContainText('encerramento deve ser depois');
  await page.getByLabel('Abertura', { exact: true }).fill('09:00');
  await page.locator('input[type=file]').first().setInputFiles('public/images/hair.jpg');
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(page.getByRole('status')).toContainText('atualizada');
  await page
    .getByRole('link', { name: 'Ir para visão cliente', exact: true })
    .or(page.getByRole('link', { name: 'Visão cliente', exact: true }))
    .first()
    .click();
  await expect(page.locator('.explore-page')).toBeVisible();
  await page.locator('.card-heading a').first().click();
  await expect(page.locator('h1')).toHaveText('Studio Ana');
  await expect(page.locator('.service-cover img')).toHaveAttribute('src', /^data:image\/jpeg/);
  await expect(page.locator('.professional-description')).toContainText('Um espaço acolhedor');
});

test('provider blocks and releases time while keeping the client agenda separate', async ({
  page,
}) => {
  await page.goto('/prestador/agenda');
  await page.getByRole('button', { name: 'Bloquear horário', exact: true }).click();
  await page.getByLabel('Horário de início').fill('14:30');
  await page.getByLabel('Horário de término').fill('15:00');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Bloquear horário', exact: true })
    .click();
  await expect(page.getByRole('alert')).toContainText('já tem um agendamento');
  await page.getByLabel('Horário de início').fill('10:30');
  await page.getByLabel('Horário de término').fill('11:30');
  await page.getByLabel('Motivo (opcional)').fill('Pausa pessoal');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Bloquear horário', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Gerenciar bloqueio Pausa pessoal' }).first(),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Gerenciar bloqueio Pausa pessoal' }).first().click();
  await page.getByRole('button', { name: 'Liberar horário' }).click();
  await page.getByRole('button', { name: 'Adicionar agendamento às 10:30', exact: true }).click();
  await page.getByLabel('Nome do cliente').fill('Bruna Melo');
  await page.getByRole('button', { name: 'Adicionar à agenda' }).click();
  await expect(
    page.getByRole('button', { name: 'Gerenciar agendamento de Bruna Melo às 10:30' }),
  ).toBeVisible();
  await page
    .getByRole('link', { name: 'Ir para visão cliente', exact: true })
    .or(page.getByRole('link', { name: 'Visão cliente', exact: true }))
    .first()
    .click();
  await expect(page.locator('.explore-page')).toBeVisible();
  await page.getByRole('link', { name: 'Agenda', exact: true }).first().click();
  await expect(page.locator('.appointment-card')).toHaveCount(1);
});

test('provider payment preferences, coupons and local payment carry through confirmation', async ({
  page,
}) => {
  await page.goto('/prestador/pagamentos');
  await page.getByRole('switch', { name: 'Aceitar Cartão de crédito' }).uncheck();
  await page.getByRole('button', { name: 'Salvar preferências' }).click();
  await expect(page.getByRole('status')).toContainText('atualizadas');
  await page
    .getByRole('link', { name: 'Ir para visão cliente', exact: true })
    .or(page.getByRole('link', { name: 'Visão cliente', exact: true }))
    .first()
    .click();
  await expect(page.locator('.explore-page')).toBeVisible();
  await page.locator('.card-heading a').first().click();
  await page.getByRole('button', { name: 'Escolher horário' }).click();
  await page.getByRole('button', { name: '10:30', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await expect(page.locator('.checkout-method-card')).toContainText('Pix');
  await page.getByRole('button', { name: 'Alterar', exact: true }).click();
  await expect(page.getByRole('dialog').getByText('Visa terminando em 4242')).toHaveCount(0);
  await page
    .getByRole('dialog')
    .getByRole('button', { name: /Dinheiro/ })
    .click();
  await page.getByLabel('Cupom de desconto').fill('PERTINHO10');
  await page.getByRole('button', { name: 'Aplicar cupom' }).click();
  await expect(page.locator('.checkout-grand-total')).toContainText('R$ 76,50');
  await page.getByRole('button', { name: 'Confirmar e pagar no local' }).click();
  await expect(page.locator('.confirmation-service')).toContainText('PAGAR NO LOCAL · R$ 76,50');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Adicionar ao calendário' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('pertinho-agendamento-demo.ics');
});

test('checkout without a time returns to the date page and closed days cannot continue', async ({
  page,
}) => {
  await page.goto('/agendamento/studio-marina/pagamento?servico=gel');
  await expect(page).toHaveURL(/\/horario\?/);
  await page.getByRole('button', { name: /Domingo, 18 de outubro/ }).click();
  for (const button of await page.locator('.booking-time-grid button').all())
    await expect(button).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Continuar', exact: true })).toBeDisabled();
  await page.goto('/agendamento/studio-marina/horario?servico=invalid');
  await expect(page.getByText('Este serviço não está disponível.')).toBeVisible();
});
