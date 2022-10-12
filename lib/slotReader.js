const ethers  = require("ethers")

let config_polygon_testnet = {
    "provider_url" : "https://polygon-mumbai.g.alchemy.com/v2/EziTiweQf9L1V2oeGQOcTPgeWk8j3qu-",
    "contractAddress" : "0x7b9A5ff0cb9B6eEe230510593176f925B0b85Ad0",
}

const config = config_polygon_testnet

const provider = new ethers.providers.JsonRpcProvider(config.provider_url)
function hex_to_ascii(str1)
{
    var hex  = str1.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
}
const readSlot = async (slotNumber, blockTag = "latest") => {
    return await provider.getStorageAt(ethers.utils.getAddress(config.contractAddress), slotNumber, blockTag);
}

// reading short + long string
const readString = async (slotNumber, blockTag = "latest") => {
    let data = await readSlot(slotNumber,blockTag)
    let length = Math.floor(parseInt(data.substring(64,66),16) / 2 )
    if (length < 32){ return hex_to_ascii(data.substring(0,64)) } 
    else{
        let no_of_slots = length / 32
        let slotHash = ethers.utils.solidityKeccak256(["uint256"], [slotNumber])
        let out_string = ''
        for (let i = 0; i < no_of_slots; i++) {
            out_string += (await readSlot(ethers.BigNumber.from(slotHash).add(i).toHexString(),blockTag)).substring(2,66)   
        }
        return hex_to_ascii(out_string.substring(0,length*2 ))
    }
}

const readVariable = async (slotNumber, type = "uint", blockTag = "latest") => {    
    if (type == "string") { return await readString(slotNumber,blockTag); }
    let data = await readSlot(slotNumber,blockTag)
    return ethers.utils.defaultAbiCoder.decode([type], data)[0]
}

const read = async (slotNumber, type = "uint", blockTag = "latest") => {
    let match = type.match(/\[(.*?)\]/) 

    if (match == null) { return await readVariable(slotNumber, type, blockTag ) }
    else{
        out_data = []
        // static 1D-array
        if (match[1].length != 0){
            for (let i = 0; i < parseInt(match[1]); i++) {
                out_data.push(await readVariable(ethers.BigNumber.from(slotNumber).add(i).toHexString(),type.replace(/\[(.*?)\]/,"") ,blockTag))
            }
            return out_data
        }

        // dynamic 1D-array 
        else{
            let arr_len = await readVariable(slotNumber, "uint256", blockTag )
            let slotHash = ethers.utils.solidityKeccak256(["uint256"], [slotNumber])
            for (let i = 0; i < arr_len; i++) {
                out_data.push(await readVariable(ethers.BigNumber.from(slotHash).add(i).toHexString(),type.replace(/\[(.*?)\]/,""),blockTag))
            }
        }
        return out_data

    }

    
}

const main = async () => {
    console.log("--- 0 uint256 ---------------- ",await read(0,"uint256"))
    console.log("--- 1 short string ----------- ",await read(1,"string"))
    console.log("--- 2 long string ------------ ",await read(2,"string"))
    console.log("--- 3 address ---------------- ",await read(3,"address"))
    console.log("--- 4 fixed array-uint[2] ---- ",await read(4,"uint256[2]"))
    console.log("--- 6 fixed array-uint[] ----- ",await read(6,"uint256[]"))
}

main()