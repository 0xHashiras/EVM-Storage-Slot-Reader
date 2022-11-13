
import { useState,useEffect } from "react";
import {QueryStruct,Output} from "./interface"
import {SlotReader} from "./../lib/slotReader"
import { ethers } from "ethers";
export const Form_new = () => {
    let slotReader:SlotReader;
    const[ContractAddress,SetContractAddress] = useState("");
    const[Provider,SetProvider] = useState("");
    const [QueryList,SetQueryList] = useState<QueryStruct[] >([]);
    const [OutputList,SetOutputList] = useState<Output[]>([]);
    const [VariableType,SetVariableType] = useState("uint");
    const [SlotNumber,SetSlotNumber] = useState("0");
    const [Id,setId]= useState(1);
    const [Bool,setBool] = useState(false);
    const [ArrayLength,setArrayLength] = useState("[]");

    // const check = [123456,789012]
    
    function HandleContractAddress(inputAddress:string){
        SetContractAddress(inputAddress)
        console.log(ContractAddress)
    }

    function HandleArrayLength(inputLength:string){
        if (inputLength == "") {
            setArrayLength("[]")
        }
        setArrayLength(inputLength)
    }

    function HandleBool(){
        if(Bool == false ){
            setBool(true)    
        } 
        else {
            setBool(false)
        }
    }

    function HandleProvider(inputProvider:string){
        SetProvider(inputProvider)
        console.log(Provider)
    }
    // function print() {
    //     console.log("ContractAddress : ",ContractAddress)
    //     console.log("Provider : ",Provider)
    //     console.log("QueryList : ",QueryList)
    // }
     useEffect(() => {
        slotReader = new SlotReader(Provider,ContractAddress)
        console.log(slotReader)
        // slotReader.test()
    }, 
    [ContractAddress,Provider,[]]);

    async function HandleFetch(){
        for (let Query of QueryList ) {
            console.log(Query.slotNumber,Query.variableType)
            let query_var
            if (Query.isArray) {
                query_var = Query.variableType + Query.arraylength
            }
            else {
                query_var = Query.variableType
            }
            let val = await slotReader.read(Query.slotNumber,query_var)
            SetOutputList((prevList) =>
            [...prevList,{id:Query.id,value:val}]
            )
            console.log("val",val)
       }
        console.log(QueryList)
    }
    function HandleClear() {
        SetQueryList([]);
    }

    function HandleAdd() {
        console.log("1")
        let temp = Id +1;
        setId(temp);
        SetQueryList ((prevList) =>
        [...prevList,{slotNumber:SlotNumber,variableType:VariableType,id:Id,isArray:Bool,arraylength:ArrayLength}]
        )
        SetVariableType("uint")
        SetSlotNumber("0");
        setArrayLength("[]")
        setBool(false)

    }
    function HandleClearOutput () {
        SetOutputList([])
    }
    function  HandleVariableChange (Variable:string) {
        SetVariableType(Variable);
    };

    function  HandleSlotChange (Slot:string) {
        SetSlotNumber(Slot);
    };

    const display = () => {
        // const[value]
        return  
        {

        }
    }


    return (
        <div>
            <div>
                <label> Contract Address </label>
                <input type="text"  placeholder="Contract Address" value={ContractAddress} onChange={e => 
                  HandleContractAddress(e.target.value)} />
            </div>

            <div>
                <label> Provider (RPC URL) </label>
                <input type="text"  placeholder="RPC Provider" value={Provider} onChange={e => 
                  HandleProvider(e.target.value)} />
            </div>
            <div>
                <fieldset>
                    <label htmlFor="Variable"  >Variable Type:</label>
                    <select  name="vars" value={VariableType} onChange={e => 
                  HandleVariableChange(e.target.value)} >
                        <option value= "uint">uint256</option>
                        <option value= "string">string</option>
                        <option value= "bytes">bytes</option>
                        <option value= "int">int</option>
                        <option value= "bool">bool</option>
                        <option value= "address">address</option>
                    </select>
                    <label htmlFor="Slot number">Slot number:</label>
                    <input name= "SlotNumber" type="string" value={SlotNumber} onChange={e => 
                  HandleSlotChange(e.target.value)} />

                    <label>Array ?</label>
                    <input type="checkbox"  onChange={e => 
                  HandleBool()}/>
                    {Bool? (
                        <div>
                            <label>ArrayLength</label>
                            <input name= "ArrayLength" type="string" placeholder="Default-Dynamic" value={ArrayLength} onChange={e => 
                  HandleArrayLength(e.target.value)} />
                        </div>
                    ):(
                        <div>

                        </div>
                    )}
                    </fieldset>
            </div>
                    <button onClick={HandleAdd}> add </button>
                    <button onClick={HandleClear}> clear</button>
        <div>
          Querys to fetch :          
          {QueryList.map((Query,index)=>(
            <div key={index}>
             Storage Slot Number = {Query.slotNumber? Query.slotNumber :0} ----- Varibale Type = {Query.variableType? Query.variableType : "null"} ------- Is Array = {Query.isArray? "True" : "False"} ----- Arraylength = {Query.arraylength? Query.arraylength : "[]"}
            </div>
          ))}
        </div>

        <div>
            <button onClick={HandleFetch} >
                Fetch
            </button>
            <button onClick={HandleClearOutput}>
                Clear Output
            </button>
        </div>
        <div>
          Response:          
          {OutputList.map((output,index)=>(
            <div key={index}>
                {console.log("output value ====",output.value)}
             ID : {output.id? output.id:"null"} ----- Value {output.value? output.value : "null"}  
            </div>
          ))}
        </div>
        {/* <div>
            {
                check.join(' , ')
            }
        </div> */}
        </div>
    )

} 