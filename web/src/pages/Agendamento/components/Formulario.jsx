import './Formulario.css'
import logo from '../../../assets/logo_pequena.png'

function Formulario() {
    return (
        <form className='agendamento-form tudo'>

            <main className="agendamento-main">
                <div className="card_1">

                    <div className="lista_servicos" id="lista_servicos">
                        <div className="servico_adicionado">
                            <label htmlFor="servico">Selecione o serviço:</label>
                            <select name="servico" className="servico">
                                <option value="1">Barba</option>
                                <option value="2">Cabelo</option>
                                <option value="3">Hidratação capilar</option>
                                <option value="4">Coloração</option>
                                <option value="5">manicure</option>
                            </select>
                            <button type="button" className="btn_servico" id="btn_add_servico" >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                    className="bi bi-plus-lg" viewBox="0 0 16 16">
                                    <path fillRule="evenodd"
                                        d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="profissional_selecionado">
                        <label htmlFor="profissional">Selecione o(a) profissional: </label>

                        <select name="profissional">
                            <option value="Roberto">Roberto</option>
                            <option value="Ronaldo">Ronaldo</option>
                            <option value="Rosalva">Rosalva</option>
                            <option value="Leila">Leila</option>
                        </select>
                    </div>

                    <div>
                        <label>Dia marcado:</label>
                        <input type="date" name="data" />
                    </div>
                    <div>
                        <label>Horario da sessão:</label>
                        <input type="time" name="horario" />
                    </div>
                </div>

                <div className="card_2">
                    <header className="agendamento-header">
                        <h1 className="agendamento-title">Agendamento</h1>
                        <img className="logo" src={logo} alt="logo secretária gestão" />
                    </header>
                    <div>
                        <select name="local" className="local">
                            <option value="">Local</option>
                            <option value="Local_Souza">Local_Souza</option>
                            <option value="Seu Jorge">Seu Jorge</option>
                            <option value="Unhas Cleide">Unhas Cleide</option>
                            <option value="Rua dos Bobos">Rua dos Bobos</option>
                            <option value="Casa Engraçada">Casa Engraçada</option>
                        </select>
                    </div>

                    <div className="div_btn">
                        <button id="btn-enviar" type="button" className="enviar solid"> Enviar </button>
                        <button id="btn-resetar" type="reset" className="resetar solid"> Resetar </button>
                    </div>

                </div>
            </main>
        </form>
    )
}

export default Formulario
