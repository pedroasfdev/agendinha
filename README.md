# Pertinho

Interface de agendamentos para barbearias, salões de beleza e serviços de bem-estar, inspirada nas referências fornecidas. Desenvolvida **mobile first** com React, TypeScript e Tailwind CSS.

Esta entrega é exclusivamente visual. Não há backend, autenticação real, chamadas a APIs, pagamentos ou reservas reais.

## Executar

```sh
npm install
npm run dev
```

Abra `http://localhost:5173`. Para validar e gerar a versão de produção:

```sh
npm run build
npm run preview
```

## Telas

| Rota                                                                             | Tela                                                      |
| -------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `/` e `/explorar`                                                                | Busca, categorias e profissionais                         |
| `/login`                                                                         | Login e prévia de recuperação de senha                    |
| `/cadastro`                                                                      | Cadastro com validação dos campos                         |
| `/perfil`                                                                        | Perfil, próximo horário, histórico e configurações        |
| `/servico/studio-marina`                                                         | Profissional, serviços e escolha de horário               |
| `/agenda`                                                                        | Próximos agendamentos e histórico                         |
| `/favoritos`                                                                     | Profissionais salvos                                      |
| `/agendamento/studio-marina/horario?servico=gel`                                 | Data e horário do cliente                                 |
| `/agendamento/studio-marina/pagamento?servico=gel&data=2026-10-17&horario=10:30` | Revisão e pagamento demonstrativo                         |
| `/confirmacao/demo-appointment`                                                  | Confirmação e exportação para calendário                  |
| `/prestador/servicos`                                                            | Serviços do prestador: ativação, edição, inclusão e ordem |
| `/prestador/pagina`                                                              | Edição da página, fotos, dias e horários de atendimento   |
| `/prestador/agenda`                                                              | Agenda do prestador, atendimentos e bloqueios             |
| `/prestador/pagamentos`                                                          | Preferências de pagamento e repasse ilustrativo           |

Os demais profissionais têm páginas de serviço próprias acessíveis pelos cartões. Acesse a área do prestador pelo ícone de maleta no cabeçalho ou pelo botão no perfil. Na área do prestador, o botão de troca de visão retorna à experiência do cliente. Esta troca é apenas uma navegação de demonstração, sem autenticação ou autorização real.

O fluxo do cliente segue: **serviço → data e horário → revisão e pagamento → confirmação → agenda**. As rotas de horário e pagamento recebem o serviço, a data e o horário na URL. A confirmação de um novo agendamento recebe seu identificador na rota; atualizar a página reinicia a demonstração, então apenas a confirmação inicial `/confirmacao/demo-appointment` continua disponível.

## Organização

```text
src/
  app/                Rotas e estado da demonstração
  components/
    layout/           Estrutura responsiva e navegação
    ui/               Componentes compartilhados e acessíveis
  data/               Tipos e catálogo demonstrativo
  features/
    auth/             Login e cadastro
    booking/          Agenda, horário, revisão, confirmação e estilos do fluxo
    discovery/        Exploração e detalhes do profissional
    profile/          Perfil e preferências
    provider/         Quatro telas do prestador, navegação e estilos
  lib/                Formatação e cálculos de horários
  styles/base.css     Tema Tailwind e estilos compartilhados
  styles.css          Entrada dos estilos compartilhados e de funcionalidades
public/
  fonts/              DM Sans local
  images/             Fotografias locais
```

A apresentação é organizada por funcionalidade. O catálogo tipado fica separado dos componentes; o estado demonstrativo é centralizado em `DemoContext` e `StudioContext`, sem misturar infraestrutura de servidor à interface. Os tokens de cor, tipografia e espaçamento estão no tema Tailwind. Não foram criadas camadas de backend antecipadamente.

## Interações demonstrativas

- Busca sem distinção de acentos, categorias, filtros e ordenação.
- Favoritos, atualização de perfil e preferências de notificações.
- Escolha de serviço, seleção de dia e horário, revisão do pagamento, confirmação e acompanhamento na agenda.
- Gestão de serviços do prestador, com ativação, inclusão, edição de preço/duração e ordenação refletidas na página do cliente.
- Edição da página com prévia ao vivo, troca de capa/foto por arquivo local e validação de dias/horários de atendimento.
- Agenda do prestador com clientes demonstrativos, criação/cancelamento de agendamentos e bloqueio/liberação de intervalos. Atendimentos de outros clientes não aparecem na agenda pessoal de Ana.
- Horários do cliente respeitam dias de funcionamento, intervalos, duração do serviço e outros atendimentos da demonstração.
- Preferências de pagamento salvas pelo prestador refletem as opções do cliente. Cartão Visa 4242, taxas, conta verificada e repasse são apenas dados de exemplo.
- Cupom demonstrativo `PERTINHO10` aplica 10% de desconto no serviço. Pagamento no local exibe valor a pagar, sem marcar como pago.
- Exportação de arquivo `.ics` com data, duração e horário de Brasília convertido para UTC, identificado como agendamento demonstrativo.
- Login e cadastro navegam para a demonstração com os dados informados. Não use credenciais reais.
- Modais com foco gerenciado pelo navegador, fechamento com Escape e rótulos acessíveis.
- Agenda ilustrativa em outubro de 2026; preços, avaliações, endereços e perfis são fictícios. O mapa é ilustrativo.

Os dados ficam **somente em memória** e são reiniciados ao atualizar a página. Nada é enviado a servidores ou persistido no navegador. Imagens selecionadas ficam apenas em memória; o arquivo de calendário é baixado somente ao clicar em “Adicionar ao calendário”. A implementação de backend depende da aprovação desta etapa visual.

## Validação no navegador

```sh
npx playwright install chromium
npm run test:e2e
```

Os testes cobrem as telas do cliente e do prestador em celular e desktop, ausência de rolagem horizontal, imagens, busca, favoritos, cadastro, perfil, gestão de serviços, edição da página, bloqueios de agenda, meios de pagamento, cupom, confirmação, exportação de calendário e cancelamento. Para usar um Chromium já instalado, defina `PLAYWRIGHT_CHROMIUM_EXECUTABLE` com o caminho do executável.

Fotografias: Unsplash. Fonte: DM Sans (Google Fonts, SIL Open Font License). Ambos são servidos localmente para que a interface não dependa de serviços externos ao abrir.
