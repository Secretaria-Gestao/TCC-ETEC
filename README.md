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
| 2    | Alta       | Como administrador, quero cadastrar meu salão e meus dados de acesso para começar a utilizar o sistema                                                                                                       | 5          | 2 | Concluído (fix de segurança pendente de merge) |
| 3    | Alta       | Como administrador, quero me autenticar com e-mail e senha para acessar o painel administrativo                                                                                                              | 3          | 2 | Concluído |
| 4    | Alta       | Como colaborador, quero me autenticar com e-mail e senha para acessar e gerenciar meus atendimentos                                                                                                          | 3          | 2 | Em andamento |
| 5    | Alta       | Como administrador, quero cadastrar, editar e desativar os serviços do meu salão, informando nome, preço e duração, para manter o catálogo oferecido pelo estabelecimento                                    | 8          | 3 | Concluído |
| 6    | Alta       | Como colaborador, quero gerenciar os meus serviços para me organizar antes do atendimento                                                                                                                    | 5          | 3 | Em andamento |
| 7    | Alta       | Como administrador, quero gerenciar os meus serviços para me organizar antes do atendimento                                                                                                                  | 5          | 3 | Em andamento |
| 8    | Alta       | Como administrador, quero cadastrar colaboradores e selecionar, um ou mais serviços que eles realizam para definir com o que trabalham no salão                                                              | 8          | 2 | Concluído |
| 9    | Alta       | Como administrador, quero editar os dados pessoais, o cargo e o nível de acesso dos colaboradores para manter as informações da equipe atualizadas                                                           | 5          | 4 | Concluído — ver observação 1 |
| 10   | Alta       | Como colaborador, quero definir meus horários de trabalho, pausas e indisponibilidades para receber agendamentos apenas quando puder atender                                                                 | 8          | 3 | Não implementado |
| 11   | Alta       | Como colaborador, quero visualizar minha agenda e os dados dos próximos atendimentos para organizar meu trabalho diário                                                                                      | 5          | 3 | Concluído |
| 12   | Alta       | Como colaborador, quero que meu cliente agende um ou mais serviços comigo em um horário disponível para garantir o atendimento                                                                               | 8          | 1 | Concluído |
| 13   | Alta       | Como administrador, quero visualizar os agendamentos de todos os colaboradores do meu salão para acompanhar e organizar a agenda do estabelecimento                                                          | 5          | 3 | Implementado com bug (nomes não aparecem) |
| 14   | Alta       | Como colaborador, quero que meus clientes visualizem seus próprios agendamentos para não perderem os horários marcados                                                                                       | 3          | 2 | Concluído |
| 15   | Alta       | Como colaborador, quero que meus clientes possam cancelar seus próprios agendamentos para liberar os horários que não serão utilizados                                                                       | 3          | 5 | Não implementado |
| 16   | Alta       | Como colaborador, quero confirmar, concluir, cancelar ou registrar a ausência em um atendimento para manter a agenda e os relatórios atualizados                                                             | 3          | 4 | Não implementado |
| 17   | Alta       | Como administrador, quero desativar o cadastro de um colaborador que não trabalha mais no salão e reativá-lo caso retorne, para impedir novos agendamentos enquanto estiver inativo sem apagar seu histórico | 3          | 4 | Concluído — ver observação 2 |
| 18   | Alta       | Como administrador, quero que o preço aplicado a cada serviço seja preservado no agendamento para que alterações futuras no catálogo não modifiquem os valores do histórico                                  | 3          | | Não implementado (preço nunca é salvo) |
| 19   | Alta       | Como administrador, quero definir para cada colaborador se o salão deve pagar a ele ou se ele deve pagar ao salão, para representar o acordo financeiro estabelecido                                         | 5          | | Não implementado |
| 20   | Alta       | Como administrador, quero visualizar um relatório com os valores que devo pagar ou receber de cada colaborador para agilizar o acerto de contas                                                              | 8          | | Não implementado |
| 21   | Média      | Como administrador, quero editar os dados e os horários de funcionamento do meu salão para manter as informações do estabelecimento atualizadas                                                              | 5          | | Não implementado (estimativa pode estar baixa) |
| 22   | Média      | Como administrador, quero gerenciar os serviços dos colaboradores para saber qual colaborador trabalha mais                                                                                                  | 5          | | Implementado com bug (mesma causa da US 13) |
| 23   | Média      | Como administrador, quero visualizar o faturamento bruto do salão por mês para acompanhar os resultados financeiros do estabelecimento                                                                       | 5          | | Tela existe, valores sempre zerados (depende da US 18) |
| 24   | Baixa      | Como administrador, quero visualizar a minha renda total no mês para saber o quanto estou colaborando com o salão                                                                                            | 2          | | Não implementado |
| 25   | Baixa      | Como colaborador, quero visualizar a minha renda total no mês para saber o quanto estou colaborando com o salão                                                                                              | 2          | | Não implementado |
| 26   | Baixa      | Como administrador, quero visualizar o total de usuários que acessaram o site para acompanhar o alcance da plataforma                                                                                        | 2          | | Não implementado |
| 27   | Baixa      | Como colaborador, quero adicionar, editar e remover imagens do meu portfólio para organizar e divulgar os serviços que já realizei                                                                           | 5          | | Não implementado |
| 28   | Baixa      | Como colaborador, quero que meus clientes visualizem meu portfólio para conhecerem os serviços que já realizei                                                                                               | 3          | | Não implementado |
| 29   | Baixa      | Como colaborador, quero que meus clientes visualizem o próprio histórico de serviços concluídos para relembrarem os atendimentos realizados no salão                                                         | 3          | | Parcial (sem filtro de “concluídos”) |
| 30   | Alta       | Como cliente, quero visualizar os salões disponíveis na plataforma para escolher onde quero agendar                                                                                                          | 3          | | Já implementado (só faltava a US) |
| 31   | Alta       | Como usuário, quero recuperar minha senha por e-mail caso eu esqueça, para não perder o acesso à minha conta                                                                                                  | 3          | | Não implementado (botão sem função) |
| 32   | Média      | Como usuário, quero entrar com minha conta do Google para agilizar o acesso ao sistema                                                                                                                        | 5          | | Não implementado (botão sem função) |
| 33   | Alta       | Como administrador, quero excluir permanentemente o salão e minha própria conta de acesso quando decidir encerrar o uso da plataforma, sendo essa uma ação exclusiva minha (o gerente não pode realizá-la), para manter o controle sobre decisões irreversíveis do negócio | 5          |        | Não implementado |

### Observações

1. **US 9** — hoje qualquer nível de acesso 1 (Administrador) ou 2 (Gerente) pode alterar o `nivel_acesso` de qualquer profissional, inclusive promovendo a si mesmo. Refinamento necessário: só o Administrador pode alterar `nivel_acesso`.

2. **US 17** — desativar/reativar deve continuar disponível para Administrador e Gerente, mas o Gerente só pode agir sobre profissionais de nível 3 (nunca sobre outro Gerente ou o Administrador). A remoção definitiva (`remover_profissional`) continua exclusiva do Administrador.

3. Níveis de acesso do sistema: 1 = Administrador (acesso total), 2 = Gerente (dia a dia do salão, sem configurações críticas), 3 = Profissional (própria agenda e perfil).