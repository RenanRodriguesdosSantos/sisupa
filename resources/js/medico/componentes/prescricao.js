import React,{Component} from 'react';
import Cancel from '../../imagens/cancel.png';

export default class Prescricao extends Component{
    constructor(){
        super();
        this.state = {
            item: {id:"",quantidade: "",prescricao: "", apresentacao: ""},
            prescricao: []
        };
        this.handleChage = this.handleChage.bind(this);
    }

    handleChage(e){
        var item  = this.state.item;
        item[e.target.id] = e.target.value.toUpperCase();
        this.setState({item: item});
    }

    adicionar(e){
        e.preventDefault();
        var item = this.state.item;
        if(!item.prescricao){
            alert("Informe uma Prescrição");
        }
        else{
            var prescricao = this.state.prescricao;
            item.id = prescricao.length + 1;
            prescricao.push(item);
            this.setState({prescricao: prescricao,item: {id: "",quantidade: "", prescricao: "", apresentacao: ""}});
        }
    }

    cancelItem(e,id){
        e.preventDefault();
        var prescricao = this.state.prescricao;
        prescricao.splice(id-1,1);

        for(var i = 0; i < prescricao.length; i++){
            prescricao[i].id = i + 1;
        }
        this.setState({prescricao: prescricao});
    }

    cancelar(e){
        e.preventDefault();
        if(confirm("Deseja realmente cancelar?\nAs informações da prescrição poderão ser perdidas!")){
            $("#prescricao").modal("toggle");
        }
    }

    render(){
        return(
            <div>
                <div className="modal fade selecionado" id="prescricao" tabIndex="-1" data-backdrop="static" role="dialog" aria-labelledby="headerModal" aria-hidden="true">
                        <div className="modal-dialog modal-xl"  role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="headerModal">Prescrição Médica</h5>
                                </div>
                            <div className="modal-body">
                                <form className="form">
                                    <div className="form-group row">
                                        <div className="col-md-2">
                                            <label htmlFor="quantidade" className=" col-form-label">Quantidade</label><br/>
                                            <input type="text" id="quantidade" className="form-control text-uppercase" onChange={this.handleChage} value={this.state.item.quantidade} placeholder="Quant. Pedida" />
                                        </div>
                                        <div className="col-md-9">
                                            <label htmlFor="prescricao" className="col-form-label">Prescrição</label><br/>
                                            <input type="text" id="prescricao" className=" form-control text-uppercase" onChange={this.handleChage} value={this.state.item.prescricao} placeholder="Prescrição Clínica/Posologia" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-2">
                                            <label htmlFor="apresentacao" className="col-form-label">Apresentação</label>
                                        </div>
                                        <div className="col-md-6">
                                            <input type="text" id="apresentacao" className=" form-control text-uppercase" onChange={this.handleChage} value={this.state.item.apresentacao} placeholder="Apresentação" />
                                        </div>
                                        <div className="col-md-3">
                                            <button className="btn btn-warning col-md-12 text-center" onClick={e => this.adicionar(e)}>Adicionar</button>
                                        </div>
                                    </div>
                                </form>
                                <div>
                                    <div className="table-responsive" id="tabela">
                                        <table id="tab" className="table table-striped" style={{textAlign: 'left'}}>
                                            <thead>
                                                <tr scope="row">
                                                    <th scope="col">Prescrição/Posologia</th>
                                                    <th scope="col">Quantidade</th>
                                                    <th scope="col">Apresentação</th>
                                                    <th scope="col">&nbsp;</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.prescricao.map(
                                                        row => 
                                                        <tr key={row.id}>
                                                            <td>{row.prescricao}</td>
                                                            <td>{row.quantidade}</td>
                                                            <td>{row.apresentacao}</td>
                                                            <td><button onClick={e => this.cancelItem(e,row.id)} className="btn btn-danger"><img src={Cancel}/></button></td>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" id="cancelar" onClick={e => this.cancelar(e)}>Cancelar</button>
                                    <button id="btnSalvar" type="button" className="btn btn-primary" onClick={e => this.salvar(e)}>Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}