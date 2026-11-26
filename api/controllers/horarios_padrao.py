from database import supabase_admin

# Horário padrão do sistema: segunda a sábado, das 08:00 às 18:00, com intervalo das 12:00 às 13:00, e domingo de folga.
# Todo salão e todo profissional novo nasce com ele e depois ajusta nas Configurações.
# No banco, dia_semana vai de 0 (domingo) a 6 (sábado).
HORA_INICIO = "08:00"
HORA_FIM = "18:00"
INTERVALO_INICIO = "12:00"
INTERVALO_FIM = "13:00"

# As duas funções abaixo NÃO derrubam o cadastro se falharem: salão ou profissional sem horário gravado simplesmente
# não tem restrição na agenda.

def gravar_horarios_padrao_profissional(id_profissional):
    try:
        linhas = []
        for dia in range(7):
            linhas.append({
                "id_profissional": id_profissional,
                "dia_semana": dia,
                "hora_inicio": HORA_INICIO,
                "hora_fim": HORA_FIM,
                "ativo": dia != 0,  # domingo (0) é de folga
                "intervalo_inicio": INTERVALO_INICIO,
                "intervalo_fim": INTERVALO_FIM,
            })

        supabase_admin.table("horarios_trabalho").insert(linhas).execute()

    except Exception as erro:
        print("Erro ao gravar os horários de trabalho padrão:", erro)

def gravar_horarios_padrao_salao(id_salao):
    try:
        linhas = []
        for dia in range(7):
            domingo = dia == 0
            linhas.append({
                "id_salao": id_salao,
                "dia_semana": dia,
                # Dia fechado grava NULL nos horários, como a rota de horários do salão faz
                "hora_abertura": None if domingo else HORA_INICIO,
                "hora_fechamento": None if domingo else HORA_FIM,
                "fechado": domingo,
            })

        supabase_admin.table("horario_funcionamento_salao").insert(linhas).execute()

    except Exception as erro:
        print("Erro ao gravar os horários de funcionamento padrão:", erro)
