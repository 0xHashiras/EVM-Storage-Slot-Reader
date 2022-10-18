
import { useState,useEffect } from "react";
import {QueryStruct} from "./interface"
import {SlotReader} from "./../lib/slotReader"

export const Form_new = () => {
    let id = 0;
    let slotReader:SlotReader;
    const[ContractAddress,setContractAddress] = useState("0x7b9A5ff0cb9B6eEe230510593176f925B0b85Ad0");
    const[Provider,setProvider] = useState("https://polygon-mumbai.g.alchemy.com/v2/EziTiweQf9L1V2oeGQOcTPgeWk8j3qu-");
    const [QueryList,setQueryList] = useState<QueryStruct[] >([]);

    function HandleContractAddress(inputAddress:string){
        setContractAddress(inputAddress)
        console.log(ContractAddress)
    }

    function HandleProvider(inputProvider:string){
        setProvider(inputProvider)
        console.log(Provider)
    }
    function print() {
        console.log(ContractAddress)
        console.log(Provider)
    }
    useEffect(() => {
        slotReader = new SlotReader(Provider,ContractAddress)
        // slotReader.test()

    }, 
    [ContractAddress,Provider]);

    async function HandleFetch(){
        for (let Query of QueryList ) {
            console.log(Query.slotNumber,Query.variableType)
            let val = await slotReader.read(Query.slotNumber,Query.variableType)

            console.log("val",val)
       }
        slotReader.read
        console.log(QueryList)
    }



    useEffect(() => {
        const form: any = document.querySelector('#QueringFrom');
        form.onsubmit = () => {
        const formData = new FormData(form);
    
        const variableType = formData.get('vars') as string;
        const SlotNumber = formData.get('SlotNumber') as string;
        ++id;
        setQueryList ((prevList) =>   {
        prevList.push({variableType:variableType ,slotNumber:SlotNumber,id:id});
        console.log(QueryList);
        return prevList
        })
        return false; // prevent reload
    };
}, [QueryList])


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
            <form id='QueringFrom'>
                <fieldset>
                    <label htmlFor="Variable">Variable Type:</label>
                    <select  name="vars">
                        <option value= "uint256">uint256</option>
                        <option value= "string">string</option>
                        <option value= "bytes">bytes</option>
                        <option value= "uin256[]">uin256[]</option>
                    </select>
                    <label htmlFor="Slot number">Slot number:</label>
                    <input name= "SlotNumber" type="string"  />
                    </fieldset>
                    <button > add </button>
                    <input type="submit"/>
        </form>
        <div>
          Querys to fetch :          
          {QueryList.map((Query,index)=>(
            <div key={index} >
              <> 
             Storage Slot Number {Query.slotNumber? Query.slotNumber :0} ----- Varibale Type {Query.variableType? Query.variableType : "null"}  
              </>
            </div>
          ))}
        </div>

        <div>
            <button onClick={HandleFetch} >
                Fetch
            </button>
        </div>
            {/* <div>
                <label htmlFor="Provider">Provider:</label>
                <select  name="Provider" onChange={(e) => {HandleProvider(e.target.value);}} >
                    <option value= "a">ETH MAINNET</option>
                    <option value= "b">b</option>
                    <option value= "c">c</option>
                    <option value= "d">d</option>
                </select>
            </div> */}

            <button onClick={print} >print</button>
        </div>
    )

} 