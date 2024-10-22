import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react'

const url = "http://localhost:5000/alunos"

function App() {

  //Guarda o resultado da requisição ao banco
  const [alunos, setAlunos] = useState([])

  //Variaveis para o novo aluno
  const [nome, setNome] = useState([])
  const [turma, setTurma] = useState([])
  const [ano_escolar, setAnoEscolar] = useState([])
  const [idAluno, setIdAluno] = useState([])

  //Estado de carregando da lista
  const [loading, setLoading] = useState(false)

  //Tratamento de erros
  const [error, setError] = useState()

  //Função para remover um aluno
  const handleRemove = async (e) => {
    e.preventDefault()

    try {
      const id = idAluno
      const res = await fetch(`http://localhost:5000/alunos/${id}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"}
      })

      const alunoRemovido = await res.json()
      console.log(alunoRemovido)

    } catch (error) {
      setError("Houve algum erro ao deletar os dados")
      console.log(error.message)
    }
  }

  //Função que adiciona os alunos após o clique
  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    const aluno = {nome, turma, ano_escolar}

    //Envia a requisição com os dados do aluno
    const res = await fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(aluno)
    })

    //Atualiza a lista de alunos na tela do client com o último aluno adicionado
    const alunoAdicionado = await res.json()
    setAlunos( (prevAlunos) => [...prevAlunos, alunoAdicionado] )

    //Limpando os campos de cadastro de alunos
    setNome("")
    setTurma("")
    setAnoEscolar("")

    setLoading(false)
  }

  //Resgatar dados da API
  useEffect(() => {
    async function fetchData(){
      setLoading(true)

      try {
      //Busca os dados
      const res = await fetch(url)

      //Converte a resposta para json
      const data = await res.json()

      setAlunos(data)
    } catch (error) {
      setError("Houve um erro ao carregar os dados")
      console.log(error)
    }

      setLoading(false)
    }

    fetchData()
  },[])
  console.log(alunos)

  return (
    <div className="App">
      {/* <h1>Async/Await</h1> */}

      <div className='add-aluno'>
      <h2>Cadastrar alunos</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Aluno: 
            <input type='text' value={nome} name='nome' onChange={(e) => {setNome(e.target.value)}}></input>
          </label>
          <label>
            Turma: 
            <input type='text' value={turma} name='turma' onChange={(e) => {setTurma(e.target.value)}}></input>
          </label>
          <label>
            Ano: 
            <input type='number' value={ano_escolar} name='ano_escolar' onChange={(e) => {setAnoEscolar(Number(e.target.value))}}></input>
          </label>
          <label>
            {loading && <input type='submit' value="Aguarde" disabled className='btn'></input>}
            {!loading && <input type='submit' value="Adicionar" className='btn'></input>}
          </label>
        </form>
        <div className='remove-aluno'>
          <h2>Remova um aluno</h2>
          <form onSubmit={handleRemove}>
          <label>
            ID aluno: 
            <input type='text' value={idAluno} name='id_aluno' onChange={(e) => {setIdAluno(e.target.value)}}></input>
          </label>
          <label>
            <input type='submit' value="Remover" className='btn'></input>
          </label>
          </form>
        </div>
      </div>

      <div className='lista-alunos'>
      <h2>Lista de alunos</h2>
      {loading && <h3>Carregando lista....</h3> }
      {/* {!loading && } */}
      {error && <h3>Houve um erro ao carregar os dados</h3> }
      {!error && (
      <ul>
        {alunos.map((alu) => (
          <li key={alu.id}>
            Aluno: {alu.nome} - Turma: {alu.turma} - Ano: {alu.ano_escolar}
          </li>
        ))}
      </ul>
      )}
      </div>

      <div className='tabela-alunos'>
        <table style={{border:"2px solid black", backgroundColor: "lightblue", margin: "0px auto"}}>
          <thead>
            <th>ID</th>
            <th>Aluno</th>
            <th>Turma</th>
            <th>Ano Escolar</th>
          </thead>
          <tbody>
            {alunos.map( (aluno) => (
              <tr key={aluno.id}>
                <td>{aluno.id}</td>
                <td>{aluno.nome}</td>
                <td>{aluno.turma}</td>
                <td>{aluno.ano_escolar}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
