import axios from "axios"

test("Deve criar uma conta", async ()=>{

    const inputSignup = {
        name: "Vitor",
        email: "test@gmail.com",
        password: "Senha123@"
    }

    const responseSignup = await axios.post("http://localhost:3001/signup", inputSignup)
    const outputSignup = responseSignup.data


    // const responseGetAccount = account

    expect(outputSignup.accountId).toBeDefined()

})