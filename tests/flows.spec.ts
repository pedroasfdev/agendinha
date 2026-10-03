import { expect, test } from '@playwright/test';

test('reference screens fit the viewport and load their local images', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const route of ['/login', '/cadastro', '/perfil', '/explorar', '/servico/studio-marina']) {
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
          .evaluateAll((images) => images.every((img) => img.complete && img.naturalWidth > 0)),
      )
      .toBe(true);
  }
  expect(errors).toEqual([]);
});

test('search, categories, empty state and favorites work together', async ({ page }) => {
  await page.goto('/explorar');
  await expect(page.locator('.professional-card')).toHaveCount(5);
  await page.getByRole('button', { name: 'Unhas', exact: true }).click();
  await expect(page.locator('.professional-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Adicionar Studio Marina aos favoritos' }).click();
  await page.goto('/favoritos'); // Navigation by reload resets the intentionally session-only demo.
  await expect(page.getByText('Seus favoritos ficam aqui')).toBeVisible();
  await page.goto('/explorar');
  await page.getByRole('button', { name: 'Adicionar Studio Marina aos favoritos' }).click();
  await page.locator('.topbar-heart').click();
  await expect(page.locator('.professional-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Remover Studio Marina dos favoritos' }).click();
  await expect(page.getByText('Seus favoritos ficam aqui')).toBeVisible();
  await page.getByRole('link', { name: 'Explorar profissionais', exact: true }).click();
  await page.getByRole('searchbox').fill('CÓRTE');
  await expect(page.locator('.professional-card')).toHaveCount(2);
  await page.getByRole('searchbox').fill('não existe');
  await expect(page.getByText('Ainda não encontramos esse cuidado')).toBeVisible();
  await page.getByRole('button', { name: 'Limpar filtros', exact: true }).click();
  await expect(page.locator('.professional-card')).toHaveCount(5);
});

test('service selection, booking confirmation and cancellation update the agenda', async ({
  page,
}) => {
  await page.goto('/servico/studio-marina');
  await page.getByRole('radio', { name: /Manicure tradicional/ }).check();
  await expect(page.locator('.service-footer strong')).toHaveText('R$ 55');
  await page.getByRole('button', { name: 'Escolher horário' }).click();
  await expect(page).toHaveURL(/\/horario\?/);
  await expect(page.getByRole('button', { name: 'Continuar', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: '14:30', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: '10:30', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await expect(page.locator('.checkout-grand-total')).toContainText('R$ 59,90');
  await page.getByRole('button', { name: 'Pagar R$ 59,90' }).click();
  await expect(page.getByRole('heading', { name: 'Agendamento confirmado!' })).toBeVisible();
  await page.getByRole('link', { name: 'Acompanhar agendamento' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Fechar', exact: true }).click();
  await expect(page.locator('.appointment-card')).toHaveCount(2);
  await expect(page.locator('.appointment-card').first()).toContainText('Manicure tradicional');
  await page.getByRole('button', { name: 'Gerenciar agendamento' }).first().click();
  await page.getByRole('button', { name: 'Cancelar agendamento', exact: true }).click();
  await page.getByRole('button', { name: 'Sim, cancelar agendamento' }).click();
  await expect(page.locator('.appointment-card')).toHaveCount(1);
});

test('profile editing and history links preserve the navigation flow', async ({ page }) => {
  await page.goto('/perfil');
  await page.getByRole('button', { name: 'Editar perfil' }).click();
  await page.getByLabel('Nome completo').fill('Carla Lima');
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(page.locator('.profile-identity h2')).toHaveText('Carla Lima');
  await page.getByRole('button', { name: /Notificações Lembretes/ }).click();
  await page.getByRole('switch', { name: /Novidades do Pertinho/ }).check();
  await page.getByRole('button', { name: 'Salvar preferências' }).click();
  await expect(page.getByText('Preferências salvas nesta sessão')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('link', { name: 'Ver todos' }).click();
  await expect(page.locator('.history-full')).toBeVisible();
});

test('registration validates required data and personalizes the demo', async ({ page }) => {
  await page.goto('/cadastro');
  await page.getByLabel('Nome completo').fill('Carla Lima');
  await page.getByLabel('E-mail', { exact: true }).fill('carla@example.com');
  await page.getByLabel('Celular', { exact: true }).fill('(11) 99999-1234');
  await page.getByLabel('Senha', { exact: true }).fill('Carla123!');
  await page.getByRole('button', { name: 'Mostrar senha' }).click();
  await expect(page.getByLabel('Senha', { exact: true })).toHaveAttribute('type', 'text');
  await expect(page.getByText('Senha forte')).toBeVisible();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Criar minha conta' }).click();
  await expect(page).toHaveURL(/\/explorar$/);
  await expect(page.getByText('Olá, Carla')).toBeVisible();
});
