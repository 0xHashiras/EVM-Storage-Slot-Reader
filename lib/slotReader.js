const ethers  = require("ethers")

class SlotReader {
    provider
    contractAddress

    constructor(provider_url,contractAddress){
        this.provider = new ethers.providers.JsonRpcProvider(provider_url)
        this.contractAddress = contractAddress
    }

    hex_to_ascii(str1)
    {
        var hex  = str1.toString();
        var str = '';
        for (var n = 0; n < hex.length; n += 2) {
            str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
        }
        return str;
    }

    async readSlot(slotNumber, blockTag = "latest") {
        return await this.provider.getStorageAt(ethers.utils.getAddress(this.contractAddress), slotNumber, blockTag);
    }
    
    // reading short + long string
    async readString (slotNumber, blockTag = "latest") {
        let data = await this.readSlot(slotNumber,blockTag)
        let length = Math.floor(parseInt(data.substring(64,66),16) / 2 )
        if (length < 32){ return this.hex_to_ascii(data.substring(0,64)) } 
        else{
            let no_of_slots = length / 32
            let slotHash = ethers.utils.solidityKeccak256(["uint256"], [slotNumber])
            let out_string = ''
            for (let i = 0; i < no_of_slots; i++) {
                out_string += (await this.readSlot(ethers.BigNumber.from(slotHash).add(i).toHexString(),blockTag)).substring(2,66)   
            }
            return this.hex_to_ascii(out_string.substring(0,length*2 ))
        }
    }
    
    async readVariable (slotNumber, type = "uint", blockTag = "latest") {    
        if (type == "string") { return await this.readString(slotNumber,blockTag); }
        let data = await this.readSlot(slotNumber,blockTag)
        return ethers.utils.defaultAbiCoder.decode([type], data)[0]
    }
    
    async read(slotNumber, type = "uint", blockTag = "latest") {
        let match = type.match(/\[(.*?)\]/) 
    
        if (match == null) { return await this.readVariable(slotNumber, type, blockTag ) }
        else{
            let out_data = []
            // static 1D-array
            if (match[1].length != 0){
                for (let i = 0; i < parseInt(match[1]); i++) {
                    out_data.push(await this.readVariable(ethers.BigNumber.from(slotNumber).add(i).toHexString(),type.replace(/\[(.*?)\]/,"") ,blockTag))
                }
                return out_data
            }
    
            // dynamic 1D-array 
            else{
                let arr_len = await this.readVariable(slotNumber, "uint256", blockTag )
                let slotHash = ethers.utils.solidityKeccak256(["uint256"], [slotNumber])
                for (let i = 0; i < arr_len; i++) {
                    out_data.push(await this.readVariable(ethers.BigNumber.from(slotHash).add(i).toHexString(),type.replace(/\[(.*?)\]/,""),blockTag))
                }
            }
            return out_data
    
        }
    
        
    }
}


const main = async () => {
    let config_polygon_testnet = {
        "provider_url" : "https://polygon-mumbai.g.alchemy.com/v2/EziTiweQf9L1V2oeGQOcTPgeWk8j3qu-",
        "contractAddress" : "0x7b9A5ff0cb9B6eEe230510593176f925B0b85Ad0",
    }
    const config = config_polygon_testnet
    let slotReader = new SlotReader(config.provider_url,config.contractAddress)
    
    console.log("--- 0 uint256 ---------------- ",await slotReader.read(0,"uint256"))
    console.log("--- 1 short string ----------- ",await slotReader.read(1,"string"))
    console.log("--- 2 long string ------------ ",await slotReader.read(2,"string"))
    console.log("--- 3 address ---------------- ",await slotReader.read(3,"address"))
    console.log("--- 4 fixed array-uint[2] ---- ",await slotReader.read(4,"uint256[2]"))
    console.log("--- 6 fixed array-uint[] ----- ",await slotReader.read(6,"uint256[]"))
}

main()

module.exports  = {SlotReader}