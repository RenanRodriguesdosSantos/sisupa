import React,{Component} from 'react';
import { preencha, salvo } from '../../components/mensagens';

export default class Cadastros extends Component{
    constructor(){
        super();
        this.state ={
            idMaterial: "",
            idMedicamento: "",
            materiais: [],
            medicamentos: [],
            material: "",
            medicamento: "",
            idExame: "",
            exame: "",
            exames: []
        }
        this.url = "/administrador/";
        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleChange(e){
        e.preventDefault();
        var campo = e.target.id;
        var valor = e.target.value.toUpperCase();
        this.setState({[campo]: valor});
    }

    handleSelect(e){
        e.preventDefault();
        var campo = e.target.id;
        var valor = e.target.value;
        this.setState({[campo]: valor});
        if(campo == 'idMaterial'){
            var materiais = this.state.materiais;
            for(var i = 0; i < materiais.length; i++){
                if(materiais[i].id == valor){
                    this.setState({material: materiais[i].nome});
                    break;
                }
            }
        }
        else if(campo == 'idMedicamento'){
            var medicamentos = this.state.medicamentos;
            for(var i = 0; i < medicamentos.length; i++){
                if(medicamentos[i].id == valor){
                    this.setState({medicamento: medicamentos[i].nome});
                    break;
                }
            }
        }
        else{
            var exames = this.state.exames;
            for(var i = 0; i < exames.length; i++){
                if(exames[i].id == valor){
                    this.setState({exame: exames[i].nome});
                    break;
                }
            }
        }
    }

    editarMateriais(e){
        e.preventDefault();
        $("#idMaterial").toggleClass("d-none");
        this.setState({['idMaterial']: "",['material']: ""});
        axios.get(this.url + "materiais/dados")
        .then(response => {this.setState({materiais: response.data})})
        .catch(e => redirect(e));
    }

    editarMedicamentos(e){
        e.preventDefault();
        $("#idMedicamento").toggleClass('d-none');
        this.setState({['idMedicamento']: "",['medicamento']: ""});
        axios.get(this.url + "medicamentos/dados")
        .then(response => {this.setState({medicamentos: response.data})})
        .catch(e => redirect(e));
    }

    editarExames(e){
        e.preventDefault();
        $("#idExame").toggleClass('d-none');
        this.setState({['idExame']: "",['exame']: ""});
        axios.get(this.url + "exames/dados")
        .then(response => {this.setState({exames: response.data})})
        .catch(e => redirect(e));
    }

    salvarMaterial(e){
        e.preventDefault();
        if(!this.state.material){
            preencha("material","#material");
        }
        else{
            var material = {
                nome: this.state.material
            }
            if(!this.state.idMaterial){
                axios.post(this.url + "material/store",material)
                .then(e => {
                    salvo();
                    axios.get(this.url + "materiais/dados")
                    .then(response => {this.setState({materiais: response.data})})
                    .catch(e => redirect(e));
                })
                .catch(e => redirect(e));
            }
            else{
                axios.put(this.url + "material/update/"+ this.state.idMaterial,material)
                .then(e => {
                    salvo();
                    axios.get(this.url + "materiais/dados")
                    .then(response => {this.setState({materiais: response.data})})
                    .catch(e => redirect(e));
                })
                .catch(e => redirect(e));
            }
            this.setState({material: "", idMaterial: ""});
        }
    }

    salvarMedicamento(e){
        e.preventDefault();
        
        if(!this.state.medicamento){
            preencha("medicamento","#medicamento");
        }
        else{
            var medicamento = {
                nome: this.state.medicamento
            }
            if(!this.state.idMedicamento){
                axios.post(this.url + "medicamento/store",medicamento)
                .then(e => {  
                    salvo();
                    axios.get(this.url + "medicamentos/dados")
                    .then(response => {this.setState({medicamentos: response.data})})
                    .catch(e => redirect(e));
                })
                .catch(e => redirect(e));
            }
            else{
                axios.put(this.url + "medicamento/update/" + this.state.idMedicamento ,medicamento)
                .then(e => {  
                    salvo()
                    axios.get(this.url + "medicamentos/dados")
                    .then(response => {this.setState({medicamentos: response.data})});
                })
                .catch(e => redirect(e));
            }
            this.setState({medicamento: "", idmedicamento: ""});
        }
    }
    salvarExame(e){
        e.preventDefault();
        
        if(!this.state.exame){
            preencha("exame","#exame");
        }
        else{
            var exame = {
                nome: this.state.exame
            }
            if(!this.state.idExame){
                axios.post(this.url + "exame/store",exame)
                .then(e => {  
                    salvo();
                    axios.get(this.url + "exames/dados")
                    .then(response => {this.setState({exames: response.data})})
                    .catch(e => redirect(e));
                })
                .catch(e => redirect(e));
            }
            else{
                axios.put(this.url + "exame/update/" + this.state.idExame ,exame)
                .then(e => {  
                    salvo()
                    axios.get(this.url + "exames/dados")
                    .then(response => {this.setState({exames: response.data})});
                })
                .catch(e => redirect(e));
            }
            this.setState({exame: "", idExame: ""});
        }
    }

    render(){
        return(
            <div>
                <h2>Cadastro de Medicamentos, Materiais e Exames</h2>
                <form>
                <div className="form-group row ">
                        <div className="col-md-12 text-center">
                            <button className="btn btn-primary col-md-3" onClick={e => this.editarMateriais(e)}>Editar Materiais</button>
                            <div className="col-md-10">
                                <select id="idMaterial" className="d-none form-control" onChange={this.handleSelect} value={this.state.idMaterial}>   
                                    {
                                        this.state.materiais.map(
                                            row =>
                                        <option value={row.id} key={row.id}>{row.nome}</option>
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="material" className="col-md-2 col-form-label"> Material: </label>
                        <div className="col-md-8">
                            <input onChange={this.handleChange} value={this.state.material} type="text" className="form-control text-uppercase" id="material" placeholder="Material"/>
                        </div>
                        <div className="col-md-2 text-right">
                            <button className="btn btn-primary col-md-12" onClick={e => this.salvarMaterial(e)}>Salvar Material</button>
                        </div>
                    </div>
                    <div className="form-group row ">
                        <div className="col-md-12 text-center">
                            <button className="btn btn-primary col-md-3" onClick={e => this.editarMedicamentos(e)}>Editar Medicamentos</button>
                            <div className="col-md-10">
                                <select id="idMedicamento" className="d-none form-control" onChange={this.handleSelect} value={this.state.idMedicamento}>   
                                    {
                                        this.state.medicamentos.map(
                                            row =>
                                        <option value={row.id} key={row.id}>{row.nome}</option>
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="medicamento" className="col-md-2 col-form-label"> Medicamento: </label>
                        <div className="col-md-8">
                            <input onChange={this.handleChange} value={this.state.medicamento} type="text" className="form-control text-uppercase" id="medicamento" placeholder="Medicamento"/>
                        </div>
                        <div className="col-md-2 text-right">
                            <button className="btn btn-primary col-md-12" onClick={e => this.salvarMedicamento(e)}>Salvar Medicamento</button>
                        </div>
                    </div>
                    <div className="form-group row ">
                        <div className="col-md-12 text-center">
                            <button className="btn btn-primary col-md-3" onClick={e => this.editarExames(e)}>Editar Exames</button>
                            <div className="col-md-10">
                                <select id="idExame" className="d-none form-control" onChange={this.handleSelect} value={this.state.idExame}>   
                                    {
                                        this.state.exames.map(
                                            row =>
                                        <option value={row.id} key={row.id}>{row.nome}</option>
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="exame" className="col-md-2 col-form-label"> Exame Lab: </label>
                        <div className="col-md-8">
                            <input onChange={this.handleChange} value={this.state.exame} type="text" className="form-control text-uppercase" id="exame" placeholder="Exame Laboratorial"/>
                        </div>
                        <div className="col-md-2 text-right">
                            <button className="btn btn-primary col-md-12" onClick={e => this.salvarExame(e)}>Salvar Exame</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}