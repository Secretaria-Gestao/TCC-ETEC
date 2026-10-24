## Trabalho de Conclusão de Curso ETEC São José dos Campos
### Equipe de desenvolvimento

<table width="100%" aling="center">
  <tr>
    <td align="center">
      <a target="_blank" href="https://github.com/JoaoLuiz07">
        <img src="https://avatars.githubusercontent.com/u/235787009?v=4" width="100px;" alt="Foto do João Luiz no GitHub"/><br>
        <sub>
          <p>João Luiz Moraes</p>
        </sub>
      </a>
    </td>
    <td align="center">
      <a target="_blank" href="https://github.com/marcelamoraesrp">
        <img src="https://avatars.githubusercontent.com/u/230621478?v=4" width="100px;" alt="Foto da Marcela Moraes no GitHub"/><br>
        <sub>
          <p>Marcela Moraes</p>
        </sub>
      </a>
    </td>
    <td align="center">
      <a target="_blank" href="https://github.com/anaajjuu85">
        <img src="https://avatars.githubusercontent.com/u/224176807?v=4" width="100px;" alt="Foto da Ana Julia Caetano no GitHub"/><br>
        <sub>
          <p>Ana Julia Caetano</p>
        </sub>
      </a>
    </td>
  </tr>
</table>


# Product Backlog

| Rank | Prioridade | User Story                                                                                                                                                                                                   | Estimativa | Sprint | Status atual |
|------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------|--------|---------------|
| 1    | Alta       | Como colaborador, quero que meu cliente se identifique no sistema para acessar a agenda do site                                                                                                              | 3          | 1 | Concluído |
| 2    | Alta       | Como administrador, quero cadastrar meu salão e meus dados de acesso para começar a utilizar o sistema                                                                                                       | 5          | 2 | Concluído |
| 3    | Alta       | Como administrador, quero me autenticar com e-mail e senha para acessar o painel administrativo                                                                                                              | 3          | 2 | Concluído |
| 4    | Alta       | Como colaborador, quero me autenticar com e-mail e senha para acessar e gerenciar meus atendimentos                                                                                                          | 3          | 4 | Parcial: o login funciona, mas leva ao destino errado e o colaborador não tem menu (KAN-32, KAN-57) |
| 5    | Alta       | Como administrador, quero cadastrar, editar e desativar os serviços do meu salão, informando nome, preço e duração, para manter o catálogo oferecido pelo estabelecimento                                    | 8          | 3 | Concluído |
| 6    | Alta       | Como colaborador, quero gerenciar os meus serviços para me organizar antes do atendimento                                                                                                                    | 5          | 5 | Não implementado: o colaborador não tem tela para ver os próprios serviços (a rota de agendamento já devolve os serviços de um profissional; KAN-62) |
| 7    | Alta       | Como administrador, quero gerenciar os meus serviços para me organizar antes do atendimento                                                                                                                  | 5          | 3 | Concluído: o administrador cria serviços e se associa a eles na tela Serviços fornecidos (KAN-63, KAN-70, KAN-75) |
| 8    | Alta       | Como administrador, quero cadastrar colaboradores e selecionar, um ou mais serviços que eles realizam para definir com o que trabalham no salão                                                              | 8          | 4 | Parcial: a tela abre e cadastra (tela branca corrigida), mas o nível padrão ainda é Administrador e a seleção de serviços só existe depois, na tela de Serviços (KAN-149) |
| 9    | Alta       | Como administrador, quero editar os dados pessoais, o cargo e o nível de acesso dos colaboradores para manter as informações da equipe atualizadas                                                           | 5          | 4 | Concluído |
| 10   | Alta       | Como colaborador, quero definir meus horários de trabalho, pausas e indisponibilidades para receber agendamentos apenas quando puder atender                                                                 | 8          | 5 | Não implementado (tabelas `horarios_trabalho` e `indisponibilidades_profissional` já existem no banco; KAN-138) |
| 11   | Alta       | Como colaborador, quero visualizar minha agenda e os dados dos próximos atendimentos para organizar meu trabalho diário                                                                                      | 5          | 3 | Concluído |
| 12   | Alta       | Como colaborador, quero que meu cliente agende um ou mais serviços comigo em um horário disponível para garantir o atendimento                                                                               | 8          | 1 | Concluído |
| 13   | Alta       | Como administrador, quero visualizar os agendamentos de todos os colaboradores do meu salão para acompanhar e organizar a agenda do estabelecimento                                                          | 5          | 4 | Quebrado: a agenda do admin nunca chama a API (KAN-146) |
| 14   | Alta       | Como colaborador, quero que meus clientes visualizem seus próprios agendamentos para não perderem os horários marcados                                                                                       | 3          | 2 | Concluído |
| 15   | Alta       | Como colaborador, quero que meus clientes possam cancelar seus próprios agendamentos para liberar os horários que não serão utilizados                                                                       | 3          | 4 | Não implementado (KAN-136) |
| 16   | Alta       | Como colaborador, quero confirmar, concluir, cancelar ou registrar a ausência em um atendimento para manter a agenda e os relatórios atualizados                                                             | 3          | 4 | Parcial: o back-end está pronto, mas os botões da agenda do colaborador quebram (KAN-147) |
| 17   | Alta       | Como administrador, quero desativar o cadastro de um colaborador que não trabalha mais no salão e reativá-lo caso retorne, para impedir novos agendamentos enquanto estiver inativo sem apagar seu histórico | 3          | 4 | Concluído |
| 18   | Alta       | Como administrador, quero que o preço aplicado a cada serviço seja preservado no agendamento para que alterações futuras no catálogo não modifiquem os valores do histórico                                  | 3          | | Concluído |
| 19   | Alta       | Como administrador, quero definir para cada colaborador se o salão deve pagar a ele ou se ele deve pagar ao salão, para representar o acordo financeiro estabelecido                                         | 5          | 5 | Não implementado (colunas `tipo_pagamento` e `valor_comissao` já existem no banco; KAN-101) |
| 20   | Alta       | Como administrador, quero visualizar um relatório com os valores que devo pagar ou receber de cada colaborador para agilizar o acerto de contas                                                              | 8          | | Não implementado |
| 21   | Média      | Como administrador, quero editar os dados e os horários de funcionamento do meu salão para manter as informações do estabelecimento atualizadas                                                              | 5          | 5 | Parcial: nome e endereço editáveis; faltam os horários de funcionamento (tabela `horario_funcionamento_salao` já existe; KAN-107) |
| 22   | Média      | Como administrador, quero gerenciar os serviços dos colaboradores para saber qual colaborador trabalha mais                                                                                                  | 5          | 4 | Quebrado: mesma causa da US 13 (KAN-146) |
| 23   | Média      | Como administrador, quero visualizar o faturamento bruto do salão por mês para acompanhar os resultados financeiros do estabelecimento                                                                       | 5          | 4 | Quebrado: depende da KAN-146; hoje só calcula a semana e inclui cancelados (KAN-115) |
| 24   | Baixa      | Como administrador, quero visualizar a minha renda total no mês para saber o quanto estou colaborando com o salão                                                                                            | 2          | | Não implementado |
| 25   | Baixa      | Como colaborador, quero visualizar a minha renda total no mês para saber o quanto estou colaborando com o salão                                                                                              | 2          | | Não implementado |
| 26   | Baixa      | Como administrador, quero visualizar o total de usuários que acessaram o site para acompanhar o alcance da plataforma                                                                                        | 2          | | Não implementado (tabela `visualizacoes_salao` já existe no banco) |
| 27   | Baixa      | Como colaborador, quero adicionar, editar e remover imagens do meu portfólio para organizar e divulgar os serviços que já realizei                                                                           | 5          | | Não implementado (tabela `portfolio_profissional` já existe no banco) |
| 28   | Baixa      | Como colaborador, quero que meus clientes visualizem meu portfólio para conhecerem os serviços que já realizei                                                                                               | 3          | | Não implementado (depende da US 27) |
| 29   | Baixa      | Como colaborador, quero que meus clientes visualizem o próprio histórico de serviços concluídos para relembrarem os atendimentos realizados no salão                                                         | 3          | 4 | Quebrado: o front nunca consulta a API e a rota do back-end tem erro de nome (KAN-148) |
| 30   | Alta       | Como cliente, quero visualizar os salões disponíveis na plataforma para escolher onde quero agendar                                                                                                          | 3          | | Concluído |
| 31   | Alta       | Como usuário, quero recuperar minha senha por e-mail caso eu esqueça, para não perder o acesso à minha conta                                                                                                  | 3          | 4 | Não implementado: o botão existe sem função (KAN-111) |
| 32   | Média      | Como usuário, quero entrar com minha conta do Google para agilizar o acesso ao sistema                                                                                                                        | 2          | | Concluído |
| 33   | Alta       | Como administrador, quero excluir permanentemente o salão e minha própria conta de acesso quando decidir encerrar o uso da plataforma, sendo essa uma ação exclusiva minha (o gerente não pode realizá-la), para manter o controle sobre decisões irreversíveis do negócio | 5          |        | Concluído (exclusão lógica: o histórico é preservado e os logins do salão são bloqueados) |
| 34   | Média      | Como usuário, quero acessar as configurações da minha conta para alterar meu e-mail, senha e nome, e, caso eu seja um profissional, também minha foto de perfil, para manter meus dados atualizados          | 5          |        | Concluído |

### Observações

1. Níveis de acesso do sistema: 1 = Administrador (acesso total), 2 = Gerente (dia a dia do salão, sem configurações críticas), 3 = Profissional (própria agenda e perfil).

### Auditoria de 24/10/2026

Revisão do código e do banco de dados feita para planejar a Sprint 4. Vários itens marcados como concluídos não funcionavam em produção; os status acima já refletem isso. Os detalhes e os critérios de aceite estão no Jira.

| Jira | Problema encontrado | Impacto |
|------|---------------------|---------|
| KAN-146 | A agenda do administrador nunca chama a API | Agenda, financeiro e ranking de profissionais sempre vazios (US 13, 22 e 23) |
| KAN-147 | Os botões de status da agenda do colaborador referenciam uma função inexistente | Confirmar, concluir, cancelar e registrar ausência não funcionam (US 16) |
| KAN-148 | O histórico do cliente sempre retorna lista vazia e a rota tem erro de nome | US 29 |
| KAN-149 | A tela de cadastro de profissional quebrava por erro de props (corrigido); continua com o nível Administrador como padrão e sem validações | US 8 |
| KAN-150 | As rotas `/api/cadastro/*` não têm autenticação e não validam os campos (corrigido para gerente e cliente em 24/10); o cadastro de profissional aceita qualquer nível de acesso; o `id_dono` do salão nunca era gravado (corrigido e preenchido nos salões existentes) | Segurança |
| KAN-137 | Conflito de horário só considera horário idêntico; agendamento cancelado continua bloqueando o horário | US 12 e 15 |
| KAN-151 | O formulário de agendamento calcula o preço em dobro e usa serviço fixo | US 12 |
| KAN-153 | A lista de salões do cliente mostra salões excluídos e salões sem nenhum profissional | US 30 |

Tabelas que já existem no banco, mas ainda não têm código: `horarios_trabalho`, `indisponibilidades_profissional`, `horario_funcionamento_salao`, `portfolio_profissional` e `visualizacoes_salao`. As colunas `tipo_pagamento` e `valor_comissao` de `profissionais` também já existem. O diagrama em `doc/diagramas` precisa ser atualizado.

### Escopo para a apresentação (proposta, a confirmar com o grupo)

- **Necessário para a demonstração:** US 1 a 5, 7 a 9, 11 a 18, 21 (horários de funcionamento), 29 a 34 e o que a Sprint 4 corrige (KAN-146 a KAN-153).
- **Entra se houver tempo (Sprint 5):** US 10 (horários de trabalho), US 19 (acordo financeiro), US 6 (colaborador vê os próprios serviços) e US 23 (faturamento mensal).
- **Proposta de ficar fora do TCC, registrando como trabalho futuro no capítulo 4.1:** US 20 (relatório a pagar/receber), US 24 e 25 (renda mensal), US 26 (acessos ao site) e US 27 e 28 (portfólio). As tabelas de portfólio e de visualizações já existem no banco.

### Planejamento até a apresentação (26/11/2026)

- **Sprint 4 (26/10 a 08/11):** corrigir o que consta como pronto e não funciona (KAN-146 a KAN-150), cancelamento pelo cliente (US 15), recuperação de senha (US 31), regras de agendamento (KAN-137) e primeira rodada de testes (seção 3.8).
- **Sprint 5 (09/11 a 22/11):** horários de trabalho e de funcionamento (US 10 e 21), acordo financeiro (US 19), segunda rodada de testes, capítulos 4 e 5 do TCC e roteiro da demonstração.
- **23 a 25/11:** ensaio da apresentação e correções pequenas.
