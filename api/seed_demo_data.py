"""Substitui os dados de demonstração fora do salão Dune."""

from database import supabase_admin


def dados(resposta):
    return resposta.data or []


def usuarios_auth():
    resposta = supabase_admin.auth.admin.list_users(page=1, per_page=1000)
    if isinstance(resposta, list):
        return resposta
    return getattr(resposta, "users", None) or getattr(resposta, "data", None) or []


def criar_profissional(email, nome, cargo, telefone, nivel_acesso, id_salao, senha):
    resposta_auth = supabase_admin.auth.admin.create_user({
        "email": email,
        "password": senha,
        "email_confirm": True,
    })
    id_profissional = str(resposta_auth.user.id)

    resposta = supabase_admin.table("profissionais").insert({
        "id_profissional": id_profissional,
        "email_profissional": email,
        "nome_profissional": nome,
        "cargo": cargo,
        "telefone_profissional": telefone,
        "nivel_acesso": nivel_acesso,
        "status": True,
        "removido": False,
        "salao_associado": id_salao,
    }).execute()

    if not dados(resposta):
        raise RuntimeError(f"Falha ao criar {nome}")

    return id_profissional


def main():
    confirmacao = input(
        "Digite EXCLUIR-FORA-DUNE para apagar os dados fora do Dune: "
    )
    if confirmacao != "EXCLUIR-FORA-DUNE":
        print("Operação cancelada.")
        return

    saloes = dados(supabase_admin.table("saloes").select("id_salao, nome_salao").execute())
    dune = [salao for salao in saloes if "dune" in (salao.get("nome_salao") or "").lower()]

    if len(dune) != 1:
        raise RuntimeError("A busca pelo Dune não encontrou exatamente um salão")

    id_dune = dune[0]["id_salao"]
    profissionais = dados(supabase_admin.table("profissionais").select(
        "id_profissional, email_profissional, salao_associado"
    ).execute())
    ids_profissionais_dune = {
        profissional["id_profissional"]
        for profissional in profissionais
        if profissional.get("salao_associado") == id_dune
    }
    auth_usuarios = usuarios_auth()
    servicos = dados(supabase_admin.table("servicos").select(
        "id_servico, salao_associado"
    ).execute())
    agendamentos = dados(supabase_admin.table("agendamentos").select(
        "id_agendamento, id_profissional, salao_associado"
    ).execute())
    vinculos_agendamentos = dados(supabase_admin.table("agendamento_servicos").select(
        "id_agendamento, id_servicos"
    ).execute())

    agendamentos_dune = [a for a in agendamentos if a["salao_associado"] == id_dune]
    ids_agendamentos_dune = {a["id_agendamento"] for a in agendamentos_dune}
    ids_servicos_historico_dune = {
        vinculo["id_servicos"]
        for vinculo in vinculos_agendamentos
        if vinculo["id_agendamento"] in ids_agendamentos_dune
    }

    profissionais_dune = {
        a["id_profissional"] for a in agendamentos_dune if a.get("id_profissional")
    }
    profissionais_fora_dune_referenciados = [
        p for p in profissionais
        if p["id_profissional"] in profissionais_dune
        and p["salao_associado"] != id_dune
    ]
    if profissionais_fora_dune_referenciados:
        raise RuntimeError(
            "Há agendamentos do Dune ligados a profissionais de outro salão; "
            "a limpeza foi cancelada para preservar o histórico."
        )

    profissionais_remover = [p for p in profissionais if p["salao_associado"] != id_dune]
    servicos_remover = [
        s for s in servicos
        if s["salao_associado"] != id_dune
        and s["id_servico"] not in ids_servicos_historico_dune
    ]
    agendamentos_remover = [a for a in agendamentos if a["salao_associado"] != id_dune]
    saloes_remover = [s for s in saloes if s["id_salao"] != id_dune]

    ids_profissionais = [p["id_profissional"] for p in profissionais_remover]
    ids_servicos = [s["id_servico"] for s in servicos_remover]
    ids_agendamentos = [a["id_agendamento"] for a in agendamentos_remover]
    ids_saloes = [s["id_salao"] for s in saloes_remover]
    contas_auth_remover = [
        usuario
        for usuario in auth_usuarios
        if str(getattr(usuario, "id", "")) not in ids_profissionais_dune
    ]

    print(f"Dune preservado: salão {id_dune}")
    print(f"Salões a remover: {len(ids_saloes)}")
    print(f"Profissionais a remover: {len(ids_profissionais)}")
    print(f"Serviços a remover: {len(ids_servicos)}")
    print(f"Agendamentos a remover: {len(ids_agendamentos)}")
    print(f"Contas Auth a remover: {len(contas_auth_remover)}")

    if ids_agendamentos:
        supabase_admin.table("agendamento_servicos").delete().in_("id_agendamento", ids_agendamentos).execute()
    if ids_profissionais:
        supabase_admin.table("profissionais_servicos").delete().in_("id_profissional", ids_profissionais).execute()
    if ids_servicos:
        supabase_admin.table("profissionais_servicos").delete().in_("id_servico", ids_servicos).execute()
    if ids_agendamentos:
        supabase_admin.table("agendamentos").delete().in_("id_agendamento", ids_agendamentos).execute()
    if ids_servicos:
        supabase_admin.table("servicos").delete().in_("id_servico", ids_servicos).execute()
    if ids_profissionais:
        supabase_admin.table("profissionais").delete().in_("id_profissional", ids_profissionais).execute()
    if ids_saloes:
        supabase_admin.table("saloes").delete().in_("id_salao", ids_saloes).execute()

    for usuario in contas_auth_remover:
        try:
            supabase_admin.auth.admin.delete_user(str(usuario.id))
        except Exception as erro:
            print("Falha ao remover conta Auth:", getattr(usuario, "email", usuario.id), erro)

    temas = [
        {
            "nome": "Ordem Paranormal",
            "endereco": "Rua da Ordem, 13 - São Paulo - SP",
            "slug": "ordem",
            "gerente": ("César Valente", "Barbeiro"),
            "profissionais": [
                ("Lia Vasconcelos", "Cabeleireira"),
                ("Tomás Moura", "Colorista"),
                ("Nina Campos", "Manicure"),
                ("Rafael Prado", "Barbeiro"),
            ],
            "servicos": [
                ("Corte Investigativo", 55, 45),
                ("Barba da Ordem", 38, 30),
                ("Hidratação do Outro Lado", 75, 60),
                ("Coloração Ritual", 95, 90),
            ],
        },
        {
            "nome": "Queens Web Studio",
            "endereco": "Rua 42, 20 - Queens, Nova York",
            "slug": "aranha",
            "gerente": ("Peter Parker", "Cabeleireiro"),
            "profissionais": [
                ("Miles Morales", "Barbeiro"),
                ("Gwen Stacy", "Colorista"),
                ("Mary Jane Watson", "Cabeleireira"),
                ("Felicia Hardy", "Manicure"),
            ],
            "servicos": [
                ("Corte Teia", 60, 45),
                ("Barba Queens", 40, 30),
                ("Hidratação Aracnídea", 80, 60),
                ("Coloração Duende", 110, 100),
            ],
        },
        {
            "nome": "Gallifrey Studio",
            "endereco": "Bad Wolf Avenue, 11 - Londres",
            "slug": "gallifrey",
            "gerente": ("Clara Oswald", "Cabeleireira"),
            "profissionais": [
                ("Rose Tyler", "Colorista"),
                ("Martha Jones", "Manicure"),
                ("Donna Noble", "Cabeleireira"),
                ("Amy Pond", "Barbeira"),
            ],
            "servicos": [
                ("Corte Gallifrey", 58, 45),
                ("Barba Bad Wolf", 42, 30),
                ("Hidratação TARDIS", 78, 60),
                ("Coloração Regeneração", 105, 90),
            ],
        },
        {
            "nome": "Scranton Paper & Beauty",
            "endereco": "Slough Avenue, 1725 - Scranton",
            "slug": "scranton",
            "gerente": ("Michael Scott", "Cabeleireiro"),
            "profissionais": [
                ("Jim Halpert", "Barbeiro"),
                ("Pam Beesly", "Cabeleireira"),
                ("Dwight Schrute", "Colorista"),
                ("Kelly Kapoor", "Manicure"),
            ],
            "servicos": [
                ("Corte Scranton", 52, 45),
                ("Barba Dunder", 36, 30),
                ("Hidratação Pretzel Day", 72, 60),
                ("Coloração Dundies", 92, 90),
            ],
        },
    ]

    credenciais = []
    total_profissionais = 0
    total_servicos = 0

    for tema in temas:
        resposta_salao = supabase_admin.table("saloes").insert({
            "nome_salao": tema["nome"],
            "endereco_salao": tema["endereco"],
            "categoria_salao": "Beleza",
        }).select("id_salao").execute()
        salao_criado = dados(resposta_salao)
        if not salao_criado:
            raise RuntimeError(f"Falha ao criar o salão {tema['nome']}")

        id_salao = salao_criado[0]["id_salao"]
        nome_gerente, cargo_gerente = tema["gerente"]
        email_gerente = f"gerente.{tema['slug']}.demo@example.com"
        senha_gerente = f"Demo_{tema['slug']}_2026!"
        ids_profissionais_novos = [criar_profissional(
            email_gerente, nome_gerente, cargo_gerente,
            "11990000001", 1, id_salao, senha_gerente
        )]
        credenciais.append((tema["nome"], email_gerente, senha_gerente))

        for indice, (nome, cargo) in enumerate(tema["profissionais"], 2):
            ids_profissionais_novos.append(criar_profissional(
                f"{tema['slug']}.prof{indice}.demo@example.com",
                nome,
                cargo,
                f"119900000{indice:02d}",
                3,
                id_salao,
                f"Demo_{tema['slug']}_{indice}_2026!",
            ))

        resposta_servicos = supabase_admin.table("servicos").insert([
            {
                "nome_servico": nome,
                "preco_servico": preco,
                "salao_associado": id_salao,
                "duracao": duracao,
                "em_funcionamento": True,
                "removido": False,
            }
            for nome, preco, duracao in tema["servicos"]
        ]).select("id_servico").execute()
        ids_servicos_novos = [s["id_servico"] for s in dados(resposta_servicos)]
        if len(ids_servicos_novos) != 4:
            raise RuntimeError(f"Falha ao criar serviços de {tema['nome']}")

        associacoes = []
        for indice, id_profissional in enumerate(ids_profissionais_novos):
            quantidade_servicos = 2 + (indice % 3)
            associacoes.extend(
                {"id_profissional": id_profissional, "id_servico": id_servico}
                for id_servico in ids_servicos_novos[:quantidade_servicos]
            )
        supabase_admin.table("profissionais_servicos").insert(associacoes).execute()

        total_profissionais += len(ids_profissionais_novos)
        total_servicos += len(ids_servicos_novos)

    print("Concluído.")
    print("Dune preservado:", id_dune)
    print("Contas Auth removidas:", len(contas_auth_remover))
    print("Profissionais criados:", total_profissionais)
    print("Serviços criados:", total_servicos)
    print("Credenciais dos gerentes:")
    for nome_salao, email, senha in credenciais:
        print(f"{nome_salao}: {email} / {senha}")


if __name__ == "__main__":
    main()
