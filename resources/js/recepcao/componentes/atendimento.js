import React, {Component} from 'react';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import Edit from '../../imagens/edit.png';
import Selecionar from '../../imagens/accept.png';
import {redirect, salvo, preencha, selecionePaciente} from '../../components/mensagens';

export default class Atendimento extends Component{
    constructor(props){
        super(props);
        this.state = {  
                        pacientes: [],
                        atendimento: {paciente: "", user: "",motivo: "1", origem: "1"},
                        user: [],
                        activePage:0,
                        itemsCountPerPage:0,
                        totalItemsCount:0,
                        municipios: [],
                        etnias: [],
                        naturalidades: [], 
                        paciente: this.props.location.state?this.props.location.state.paciente:{nome: "", mae: "",nascimento: "",etnia: "" ,municipio: "", bairro: "",naturalidade: "", profissao: "", numero: "", logradouro: "", complemento: "",sexo: "",pai: "",telefone:"",cpf:"",rg: "",cns: "",uf: "MG",ufn: "MG"}
                    };

        this.handleChange = this.handleChange.bind(this);
        this.handleSelectUF = this.handleSelectUF.bind(this);
        this.handleChangeAtendimento = this.handleChangeAtendimento.bind(this);
        this.api = "/recepcao/";

        axios.get("/user")
        .then(response => {this.setState({user: response.data})})
        .catch((e) =>{redirect(e)});

        $(document).ready(function(){
            $('.nome').mask('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',{translation: {
                'a': {pattern: /[a-zA-Z ]/}
              }});
            $('.cpf').mask('000.000.000-00');
            $('.cns').mask('000 0000 0000 0000');
            $('.rg').mask("AAAAAAAAAAA");
            $('.telefone').mask('(00) 00000-0000');
            $('.numero').mask('0000000');
        });
    }

    handleChange(e){
        var paciente = this.state.paciente;
        var valor = e.target.value;
        valor = valor.toUpperCase();
        valor = valor.replace(/\s{1,20}/g," ");
        paciente[e.target.id] = valor;
        this.setState({paciente: paciente});
    }

    handleChangeAtendimento(e){
        var atendimento = this.state.atendimento;
        atendimento[e.target.id] = e.target.value;
        this.setState({atendimento: atendimento});
    }

    handleSelectUF(e){
        var campo = e.target.id;
        var valor = e.target.value;
        var paciente = this.state.paciente;
    
        if(campo == 'uf'){
            paciente.municipio = "";
            paciente.uf = valor;
            this.setState({paciente: paciente});
            axios.get(this.api + "municipios/"+ valor)
            .then((response) => {this.setState({municipios: response.data})})
            .catch(e => {redirect(e)});
        }
        else{
            paciente.ufn = valor;
            paciente.naturalidade = "";
            this.setState({paciente: paciente});
            axios.get(this.api + "municipios/"+ valor)
            .then((response) => {this.setState({naturalidades: response.data})})
            .catch(e => {redirect(e)});
        }
    }


    handlePageChange(pageNumber){
        const pacientes = {
            nome: !this.state.paciente.nome?"_":this.state.paciente.nome,
            mae: !this.state.paciente.mae?"_":this.state.paciente.mae,
            nascimento: this.state.paciente.nascimento
        }
        $(document).ready(function(){
            $("#tabela").addClass("d-none");
            $("#spinner").removeClass("d-none");
        });

        axios.get(this.api + "paciente/"+ pacientes.nome + "/" + pacientes.mae + "/" + pacientes.nascimento + "?page="+pageNumber)
        .then(response => this.closeLoading(response))
        .catch(e => {redirect(e)});

    }

    buscar(e){
        e.preventDefault();
        if(!(!this.state.paciente.nome && !this.state.paciente.mae && !this.state.paciente.nascimento)){
            const pacientes = {
                nome: !this.state.paciente.nome?"_":this.state.paciente.nome,
                mae: !this.state.paciente.mae?"_":this.state.paciente.mae,
                nascimento: this.state.paciente.nascimento
            }
            $(document).ready(function(){
                $("#tabela").addClass("d-none");
                $("#spinner").removeClass("d-none");
            })
            
            axios.get(this.api + "paciente/" + pacientes.nome + "/" + pacientes.mae + "/" + pacientes.nascimento)
            .then(response => this.closeLoading(response))
            .catch(e => {redirect(e)});
        }
    }

    closeLoading(response){
        this.setState({
                pacientes: response.data.data,
                activePage: response.data.current_page,
                itemsCountPerPage: response.data.per_page,
                totalItemsCount: response.data.total
        });
        $(document).ready(function() {
            $("#tabela").removeClass("d-none");
            $("#spinner").addClass('d-none');
        })
    }

    selecionar(e, row){
        e.preventDefault()
        var atendimento = this.state.atendimento;
        var paciente = this.state.paciente;
        atendimento.paciente = row.id;
        paciente.nome = row.nome;
        paciente.mae = row.mae;
        paciente.nascimento = row.nascimento;
        this.setState({paciente: paciente, atendimento: atendimento});
        this.fecharModal(e);
    }

    incluir(e){
       e.preventDefault();
        const atendimento = {
            paciente: this.state.atendimento.paciente,
            recepcionista: this.state.user.id,
            motivo: this.state.atendimento.motivo,
            origem: this.state.atendimento.origem
        }
        
        if(!atendimento.paciente){
            selecionePaciente();
        }
        else{
            if(!this.state.atendimento.id){
                axios.post(this.api + 'atendimento/store',atendimento)
                .then((e) => salvo())
                .catch((e) => { redirect(e)});
            }
            else{
                axios.put(this.api + 'atendimento/update/'+this.state.atendimento.id,atendimento)
                .then((e) => salvo())
                .catch((e) => { redirect(e)});
            }
            this.cancelar(e);
        }
    }

    //seta os campos da tela de atendimento de acordo com paciente salvo ou modificado
    setarCampos(paciente){
        var atendimento = this.state.atendimento;
        atendimento.nome = paciente.nome;
        atendimento.mae = paciente.mae;
        atendimento.nascimento = paciente.nascimento;
        this.setState({atendimento: atendimento});
    }

    //cadastar novo paciente
    cadastrar(e){
        e.preventDefault();
        $(document).ready(function() {
            $('#headerModal').text('Cadastro de Paciente');
            $('#bodyBuscar').addClass('d-none');
            $('#bodyCadastrar').removeClass('d-none');
            $('#btnCadastrar').addClass('d-none');
            $('#btnSalvar').removeClass('d-none');
        })
        this.listar();
    }

    fecharModal(e){
        e.preventDefault();

        this.setState({pacientes: []});
        $(document).ready(function() {
            $('#bodyCadastrar').addClass('d-none');
            $('#bodyBuscar').removeClass('d-none');
            $('#btnCadastrar').removeClass('d-none');
            $('#btnSalvar').addClass('d-none');
            $('#headerModal').text('Selecionar Paciente');
        })

        if(e.target.id == "cancelar"){
            var atendimento = this.state.atendimento;
            atendimento.paciente = "";
            this.setState({atendimento: atendimento});
            this.setState({paciente:{nome: "", mae: "",nascimento: "",etnia: "" ,municipio: "", bairro: "",naturalidade: "", profissao: "", numero: "", logradouro: "", complemento: "",sexo: "",pai: "",telefone:"",cpf:"",rg: "",cns: "",uf: "MG",ufn: "MG"}});
        }

    }

    //////// ====== MÉTODOS UTILIZADOS PARA CADASTRO DE PACIENTE ==========////////

    listar(){ // Busca no Banco de dados os dados para ComboBox
        axios.get(this.api + "municipios/"+"MG")
        .then((response)=> {this.setState({municipios: response.data, naturalidades: response.data})})
        .catch((e) => { redirect(e)});

        axios.get(this.api + 'etnias')
        .then((response) => {this.setState({etnias: response.data})})
        .catch((e) => { redirect(e)});
    }

    salvar(e){
        e.preventDefault();

        const paciente = this.state.paciente;
        var prenchido = {municipio: false, naturalidade: false, etnia: false};
        //Para tranformar o nome em id para salvar no banco
        for(var i = 0; i < this.state.municipios.length; i++){
            if(this.state.paciente.municipio == this.state.municipios[i].nome){
                paciente.municipio = this.state.municipios[i].id;
                prenchido.municipio = true;
                break;
            }
        }
        for(var i = 0; i < this.state.naturalidades.length; i++){
            if(this.state.paciente.naturalidade == this.state.naturalidades[i].nome){
                paciente.naturalidade = this.state.naturalidades[i].id;
                prenchido.naturalidade = true;
                break;
            }
        }

        //Para tranformar o nome em id para salvar no banco
        for(var i = 0; i < this.state.etnias.length; i++){
            if(this.state.paciente.etnia == this.state.etnias[i].nome){
                paciente.etnia = this.state.etnias[i].id;
                prenchido.etnia = true;
                break;
            }
        }

        if(!paciente.nome){
            preencha("nome","#name");
        }
        else if(!paciente.mae){
            preencha("mãe","#mae");
        }
        else if(!paciente.nascimento){
            preencha("nascimento","#nascimento");
        }
        else if(!paciente.sexo || !paciente.sexo == 0){
            preencha("sexo","#sexo");
        }
        else if(!prenchido.etnia){
            preencha("etnia","#etnia");
        }
        else if(!prenchido.naturalidade){
            preencha("naturalidade","#naturalidade");
        }
        else if(!paciente.logradouro){
            preencha("logradouro","#logradouro");
        }
        else if(!paciente.numero){
            preencha("número da residência","#numero");
        }
        else if(!paciente.bairro){
            preencha("bairro","#bairro");
        }
        else if(!prenchido.municipio){
            preencha("município","#municipio");
        }
        else{
            if(!this.state.paciente.id){
                var atendimento = this.state.atendimento;
                axios.post(this.api + 'paciente/store',paciente)
                .then(response => { salvo();atendimento.paciente = response.data})
                .catch((e) => { redirect(e)});
                this.setState({atendimento: atendimento});
            }
            else{
                axios.put(this.api + 'paciente/update/'+this.state.paciente.id,paciente)
                .then(e => {salvo();})
                .catch((e) => { redirect(e)});
            }
            $(document).ready(function() {
                $('#paciente').modal('toggle');
            })
            this.fecharModal(e);
        }
    }

    cancelar(e){
        this.setState({atendimento: {paciente: "", motivo: "1", origem: "1"}});
        this.setState({paciente:{nome: "", mae: "",nascimento: "",etnia: "" ,municipio: "", bairro: "",naturalidade: "", profissao: "", numero: "", logradouro: "", complemento: "",sexo: "",pai: "",telefone:"",cpf:"",rg: "",cns: "",uf: "MG",ufn: "MG"}});
    }

    //////// ====== ==== ==== ==== ==== ==== ==== ==== ==== ==== ==========////////
    //////// ========== MÉTODOS USADOS PARA EDITAR UM PACIENTE  ===========////////
    editarPaciente(row){
        axios.get(this.api + "municipios/"+ row.uf)
        .then((response)=> {this.setState({municipios: response.data})})
        .catch((e) => { redirect(e)});

        axios.get(this.api + "municipios/"+ row.ufn)
        .then((response)=> {this.setState({naturalidades: response.data})})
        .catch((e) => { redirect(e)});

        axios.get(this.api + 'etnias')
        .then((response) => {this.setState({etnias: response.data})})
        .catch((e) => { redirect(e)});

        var paciente = this.state.paciente;
        paciente.id = row.id;
        paciente.nome = row.nome;
        paciente.mae = row.mae;
        paciente.pai = !row.pai?"":row.pai;
        paciente.nascimento = row.nascimento;
        paciente.profissao = !row.profissao?"":row.profissao;
        paciente.logradouro = row.logradouro;
        paciente.complemento = !row.complemento?"":row.complemento;
        paciente.numero = row.numero;
        paciente.etnia = row.etnia;
        paciente.naturalidade = row.naturalidade;
        paciente.cpf = !row.cpf?"":row.cpf;
        paciente.cns = !row.cns?"":row.cns;
        paciente.rg = !row.rg?"":row.rg;
        paciente.ufn = row.ufn;
        paciente.uf = row.uf;
        paciente.sexo = row.sexo;
        paciente.telefone = !row.telefone?"":row.telefone;
        paciente.bairro = row.bairro;
        paciente.municipio = row.municipio;
        var atendimento = this.state.atendimento;
        atendimento.paciente = paciente.id;
        this.setState({atendimento: atendimento});

        this.setState({paciente: paciente});
        $(document).ready(function() {
            $('#headerModal').text('Cadastro de Paciente');
            $('#bodyBuscar').addClass('d-none');
            $('#bodyCadastrar').removeClass('d-none');
            $('#btnCadastrar').addClass('d-none');
            $('#btnSalvar').removeClass('d-none');
        });
    }
    //////// ========== ======= ============ ======== ========  ===========////////
    render(){
        return(
            <div className="container-fluid">
                <h2 className="text-center">Atendimento da Recepção</h2>
                <br/><br/>
                <div className="formulario" > 
                    <div className="form-group row">
                        <div className="col-md-6 border border-dark">
                            <form id="identificacao">
                                <center><h5>Identificação do Paciente</h5></center>
                                <div className="form-group row">
                                    <label htmlFor="nome" className="col-sm-2 col-form-label "> Nome: </label>
                                    <div className="col-sm-10">
                                        <input onChange={this.handleChange} value={this.state.paciente.nome} type="text" className="form-control text-uppercase nome" id="nome" placeholder="Nome do paciente"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="mae" className="col-sm-2 col-form-label text-uppercase"> Mãe: </label>
                                    <div className="col-sm-10">
                                        <input onChange={this.handleChange} value={this.state.paciente.mae} type="text" className="form-control text-uppercase nome" id="mae" placeholder="Nome da mãe"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="nascimento" className="col-sm-2 col-form-label"> Nascimento: </label>
                                    <div className="col-sm-10">
                                        <input onChange={this.handleChange} value={this.state.paciente.nascimento} type="date" className="form-control text-uppercase" id="nascimento" placeholder="Nascimento"/>
                                    </div>
                                </div>
                                <div className="form-group row ">
                                    <div className="col-sm-12 text-center">
                                        
                                            <button id="btnBuscarPaciente" onClick={(e) => this.buscar(e)} data-toggle="modal" data-target="#paciente" className="btn btn-success col-6"> BUSCAR </button>
                                        
                                    </div>
                                </div>
                            </form> 
                        </div>
                        <div className="col-md-6 border border-dark">
                            <form id="identificacao">
                                <center><h5>Dados do Atendimento</h5></center>
                                <br/>
                                <div className="form-group row">
                                    <label htmlFor="motivo" className="col-sm-2 col-form-label "> Motivo: </label>
                                    <div className="col-sm-10">
                                        <select id="motivo" className="form-control" onChange={this.handleChangeAtendimento} value={this.state.atendimento.motivo}>
                                            <option value="1">NÃO SE APLICA</option>
                                            <option value="2">ACIDENTE DE TRABALHO</option>
                                        </select>
                                    </div>
                                </div>
                                <br/>
                                <div className="form-group row">
                                    <label htmlFor="origem" className="col-sm-2 col-form-label "> Origem: </label>
                                    <div className="col-sm-10">
                                        <select id="origem" className="form-control" onChange={this.handleChangeAtendimento} value={this.state.atendimento.origem}>
                                            <option value="1">PORTA ABERTA</option>
                                            <option value="2">RETORNO</option>
                                            <option value="3">ELETIVA</option>
                                        </select>
                                    </div>
                                </div>
                            </form> 
                        </div>
                    </div>
                    <div className="modal fade selecionado" id="paciente" tabIndex="-1" data-backdrop="static" role="dialog" aria-labelledby="headerModal" aria-hidden="true">
                        <div className="modal-dialog modal-xl"  role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="headerModal">Selecionar Paciente</h5>
                                    <button type="button" className="close" onClick={e => this.fecharModal(e)} data-dismiss="modal" aria-label="Fechar">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            <div className="modal-body">
                                <div id="bodyBuscar">
                                    <div> 
                                        <form>
                                            <div className="form-group row">
                                                <label htmlFor="nome" className="col-sm-1 col-form-label"> Nome: </label>
                                                <div className="col-sm-7">
                                                    <input onChange={this.handleChange} value={this.state.paciente.nome} type="text" className="form-control text-uppercase nome" id="nome" placeholder="Nome do paciente"/>
                                                </div>
                                                <label htmlFor="nascimento" className="col-sm-1 col-form-label"> Nascimento: </label>
                                                <div className="col-sm-3">
                                                    <input onChange={this.handleChange} value={this.state.paciente.nascimento} type="date" className="form-control text-uppercase" id="nascimento" placeholder="Nascimento"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="mae" className="col-sm-1 col-form-label"> Mãe: </label>
                                                <div className="col-sm-7">
                                                    <input onChange={this.handleChange} value={this.state.paciente.mae} type="text" className="form-control text-uppercase nome" id="mae" placeholder="Nome da mãe"/>
                                                </div>
                                                <div className="col-sm-3">
                                                    <button onClick={(e) => this.buscar(e)} className="btn btn-success col-sm-12 mt-1 m-md-0" > Buscar </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <center>
                                        <div className="spinner-border d-none" id="spinner" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </center>
                                    <div className="table-responsive" id="tabela">
                                        <table id="tab" className="table table-striped" style={{textAlign: 'left'}}>
                                            <thead>
                                                <tr scope="row">
                                                    <th scope="col"> Nome </th>
                                                    <th scope="col"> Mãe </th>
                                                    <th scope="col"> Nascimento </th>
                                                    <th scope="col">Opções</th>
                                                    <th scope="col">CNS</th>
                                                    <th scope="col">CPF</th>
                                                    <th scope="col">RG</th>
                                                    <th scope="col">Telefone</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.pacientes.map(
                                                    row=>
                                                    <tr key={row.id}>
                                                        <td> {row.nome} </td>
                                                        <td> {row.mae} </td>
                                                        <td> {new Date(row.nascimento).toLocaleDateString()} </td>
                                                        <td><button className="btn btn-warning" onClick={e => this.editarPaciente(row)}><img src={Edit}/></button><button className="btn btn-primary" data-dismiss="modal"  onClick = {e => this.selecionar(e, row)}><img src={Selecionar}/></button></td>       
                                                        <td> {row.cns} </td>
                                                        <td> {row.cpf} </td>
                                                        <td> {row.rg} </td>
                                                        <td> {row.telefone} </td>
                                                    </tr>
                                                    )}
                                            </tbody>
                                        </table>
                                        <div>
                                            <center>
                                                <div className="col-md-3">
                                                    <Pagination
                                                    activePage={this.state.activePage}
                                                    itemsCountPerPage={this.state.itemsCountPerPage}
                                                    totalItemsCount={this.state.totalItemsCount}
                                                    pageRangeDisplayed={5}
                                                    onChange={e => this.handlePageChange(e)}
                                                    itemClass="page-item"
                                                    linkClass="page-link"
                                                    />
                                                </div>
                                            </center>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-none" id="bodyCadastrar">
                                    <form id="formPaciente" className="row">
                                        <div className="col-md-6 border border-dark">
                                            <center><h5>Dados Pessoais</h5></center>
                                            <div className="form-group row">
                                                <label htmlFor="nome" className="col-sm-2 col-form-label"> Nome: </label>
                                                <div className="col-sm-10">
                                                    <input onChange={this.handleChange} value={this.state.paciente.nome} type="text" className="form-control text-uppercase nome" id="nome" name="nome" placeholder="Nome do paciente"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="mae" className="col-sm-2 col-form-label"> Mãe: </label>
                                                <div className="col-sm-10">
                                                    <input onChange={this.handleChange} value={this.state.paciente.mae} type="text" className="form-control text-uppercase nome" name="mae" id="mae" placeholder="Nome da mãe"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="pai" className="col-sm-2 col-form-label"> Pai: </label>
                                                <div className="col-sm-10">
                                                    <input onChange={this.handleChange} value={this.state.paciente.pai} type="text" className="form-control text-uppercase nome" id="pai" placeholder="Nome da pai"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="nascimento" className="col-sm-2 col-form-label"> Nascimento: </label>
                                                <div className="col-sm-5">
                                                    <input onChange={this.handleChange} value={this.state.paciente.nascimento} type="date" className="form-control text-uppercase" id="nascimento" name="nascimento" placeholder="Nascimento"/>
                                                </div>
                                                <label htmlFor="sexo" className="col-sm-1 col-form-label"> Sexo: </label>
                                                <div className="col-sm-4">
                                                    <select onChange={this.handleChange} value={this.state.paciente.sexo} className="form-control text-uppercase" id="sexo" placeholder="Sexo">
                                                        <option value="0">Selecione</option>
                                                        <option value="F">Feminino</option>
                                                        <option value="M">Masculino</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="etnia" className="col-sm-2 col-form-label"> Etnia: </label>
                                                <div className="col-sm-10">
                                                <input className="form-control text-uppercase" type="text" id="etnia" list="cbEtnia" onChange={this.handleChange} value={this.state.paciente.etnia} placeholder="Etnia"/>
                                                    <datalist id="cbEtnia">   
                                                            {
                                                                this.state.etnias.map(
                                                                    row =>
                                                                    <option key={row.id} value={row.nome}/>           
                                                                )
                                                            }
                                                    </datalist>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ufn" className="col-sm-2 col-form-label"> UF Nasc: </label>
                                                <div className="col-sm-10">
                                                    <select className="form-control text-uppercase" id="ufn"  onChange={this.handleSelectUF} value={this.state.paciente.ufn}  placeholder="UF Nasc:">
                                                        <option value="AM">AMAZONAS</option>
                                                        <option value="MG">MINAS GERAIS</option>
                                                        <option value="RJ">RIO DE JANEIRO</option>
                                                        <option value="RS">RIO GRANDE DO SUL</option>
                                                        <option value="SP">SÃO PAULO</option>
                                                    </select>   
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="naturalidade" className="col-sm-2 col-form-label"> Naturalidade: </label>
                                                <div className="col-sm-10">
                                                    <input className="form-control text-uppercase" type="text" id="naturalidade"  list="cbNaturalidade" onChange={this.handleChange} value={this.state.paciente.naturalidade} placeholder="Naturalidade"/>
                                                    <datalist id="cbNaturalidade">   
                                                            {
                                                                this.state.naturalidades.map(
                                                                    row =>
                                                                    <option key={row.id} value={row.nome}/>           
                                                                )
                                                            }
                                                    </datalist>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="profissao" className="col-sm-2 col-form-label"> Profissão: </label>
                                                <div className="col-sm-10">
                                                    <input onChange={this.handleChange} value={this.state.paciente.profissao} type="text" className="form-control text-uppercase" id="profissao" placeholder="Profissão/Ocupação"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 border border-dark">
                                            <center><h5>Endereço</h5></center>
                                            <div className="form-group row">
                                                <label htmlFor="logradouro" className="col-sm-3 col-form-label"> Logradouro: </label>
                                                <div className="col-sm-9">
                                                    <input onChange={this.handleChange} value={this.state.paciente.logradouro} type="text" className="form-control text-uppercase" id="logradouro" placeholder="Logradouro"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="numero" className="col-sm-3 col-form-label"> Número: </label>
                                                <div className="col-sm-3">
                                                    <input onChange={this.handleChange} value={this.state.paciente.numero} type="text" className="form-control text-uppercase numero" id="numero" placeholder="Número da Residência"/>
                                                </div>
                                                <label htmlFor="telefone" className="col-sm-2 col-form-label"> Telefone: </label>
                                                <div className="col-sm-4">
                                                    <input onChange={this.handleChange} value={this.state.paciente.telefone} type="text" className="form-control text-uppercase telefone" id="telefone" placeholder="Telefone"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="complemento" className="col-sm-3 col-form-label"> Complemento: </label>
                                                <div className="col-sm-9">
                                                    <input onChange={this.handleChange} value={this.state.paciente.complemento} type="text" className="form-control text-uppercase" id="complemento" placeholder="Complemento"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="bairro" className="col-sm-3 col-form-label"> Bairro: </label>
                                                <div className="col-sm-9">
                                                    <input className="form-control text-uppercase" type="text" id="bairro" list="cbBairro" onChange={this.handleChange} value={this.state.paciente.bairro} placeholder="Bairro"/>
                                                    <datalist id="cbBairro">
                                                        <option value="BELA VISTA" />
                                                        <option value="CENTRO" />
                                                        <option value="SAO CRISTOVAO" />
                                                        <option value="SAO JACINTO" />
                                                        <option value="VIRIATO" />
                                                    </datalist>   
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="uf" className="col-sm-3 col-form-label"> U. Federal: </label>
                                                <div className="col-sm-9">
                                                    <select className="form-control text-uppercase" id="uf"  onChange={this.handleSelectUF} value={this.state.paciente.uf}  placeholder="UF">
                                                        <option value="AM">AMAZONAS</option>
                                                        <option value="MG">MINAS GERAIS</option>
                                                        <option value="RJ">RIO DE JANEIRO</option>
                                                        <option value="RS">RIO GRANDE DO SUL</option>
                                                        <option value="SP">SÃO PAULO</option>
                                                    </select>   
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="municipio"  className="col-sm-3 col-form-label"> Município: </label>
                                                <div className="col-sm-9">
                                                    <input className="form-control text-uppercase" type="text" id="municipio" list="cbMunicipio" onChange={this.handleChange} value={this.state.paciente.municipio} placeholder="Município"/>
                                                    <datalist ref="cb" id="cbMunicipio" >   
                                                        {
                                                            this.state.municipios.map(
                                                                row =>
                                                                <option key={row.id} value = {row.nome}/>           
                                                            )
                                                        }
                                                    </datalist>
                                                </div>
                                            </div>
                                            <h5 className="text-center">Documentos</h5>
                                            <div className="form-group row">
                                                <label htmlFor="rg" className="col-sm-2 col-form-label"> RG: </label>
                                                <div className="col-sm-4">
                                                    <input onChange={this.handleChange} value={this.state.paciente.rg} type="text" className="form-control text-uppercase rg" id="rg" placeholder="Número do RG"/>
                                                </div>
                                                <label htmlFor="cpf" className="col-sm-2 col-form-label"> CPF: </label>
                                                <div className="col-sm-4">
                                                    <input onChange={this.handleChange} value={this.state.paciente.cpf} type="text" className="form-control text-uppercase cpf" id="cpf" placeholder="Número do CPF"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="cns" className="col-sm-2 col-form-label"> CNS: </label>
                                                <div className="col-sm-10">
                                                    <input onChange={this.handleChange} value={this.state.paciente.cns} type="text" className="form-control text-uppercase cns" id="cns" placeholder="Cartão SUS"/>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-warning" id="cancelar" onClick={e => this.fecharModal(e)} data-dismiss="modal">Cancelar</button>
                                    <button id="btnCadastrar" type="button" className="btn btn-primary" onClick={e => this.cadastrar(e)}>Cadastrar</button>
                                    <button id="btnSalvar" type="button" className="btn btn-primary d-none" onClick={e => this.salvar(e)}>Salvar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div  className="col-md-12 text-right mt-1">
                        <button className="btn col-md-2 btn-warning" onClick={e => this.cancelar(e)}>Cancelar</button>&nbsp;
                        <button className="btn col-md-2 btn-primary" onClick={e => this.incluir(e)} > Salvar </button>&nbsp;
                    </div>
                </div>
                <br/>
            </div>
        );
    }
}