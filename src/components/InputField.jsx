import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./InputField.css"


const InputField = () => {

    const [input, setInput] = useState(["","","","","",""]) //input array containing all input boxes
    const [confirmed, setConfirmed] = useState(false) //boolean indicating if the validation worked or not
    const [textType, setTextType] = useState("text") //used to change the text type within the input boxes(password or text)
    const [errorOccurred, setErrorOccurred] = useState(false) //boolean indicating if there was an error or not 


    //Whenever the input array is updated, this is called
    useEffect(() => {
        if (input.length === 6) {
            setErrorOccurred(false)
            handleSubmit()
        }
    }, [input]);

    //function to update the input with inputted values
    function updateInput(value, index, event) {

        //updating the input variable
        let temp_input = [...input]; //Making shallow copy of array
        temp_input[index] = value; 
        setInput(temp_input)


        //skipping to next input box automatically and highlighting it
        const inputBox = event.target
        if (inputBox.nextElementSibling && value) {
            inputBox.nextElementSibling.focus()
            inputBox.nextElementSibling.select()
        }
    }

    //function to fill in rest of input boxes when copy pasting into first box
    function handlePaste(event) {
        const pasteData = event.clipboardData.getData("text")
        let temp_input = [...input]
        for (let i = 0; i < pasteData.length; i++) {
            temp_input[i] = pasteData[i]
        }
        setInput(temp_input)
    }

    //changed the text type to the opposite it was
    function handlePasswordMode() {
        textType === "password" ? setTextType("text") : setTextType("password")
    }

    //submitting the input to the api
    async function handleSubmit(e) {
        if (e) {
            e.preventDefault()
        }

        let stringInput = input.toString()
        stringInput = stringInput.replaceAll(",", "") //changing input array to string

        const dataSent = {
            "code": stringInput
        }

        //Should be an error when input is "000000" but could be a bug with api 
        //since error only occurs at "00000" (5 zeros instead of 5)
        const response = await axios.post("validate", dataSent)
            .catch(error => {
                setErrorOccurred(true)
            });
            if(response){
                setConfirmed(response.data.valid) //changing the confirmed boolean to whatever is returned
            }

    }

    return (
        <div className="input__form--wrapper">
            <h2>Enter your authentication code:</h2>
            <form className="input--form" action="" onSubmit={(event) => { handleSubmit(event) }}>
                <input className="input--box" type={textType} value={input[0]} onChange={(event) => { updateInput(event.target.value, 0, event) }} onPaste={(event) => { handlePaste(event) }} maxLength="1" />
                <input className="input--box" type={textType} value={input[1]} onChange={(event) => { updateInput(event.target.value, 1, event) }} maxLength="1" />
                <input className="input--box" type={textType} value={input[2]} onChange={(event) => { updateInput(event.target.value, 2, event) }} maxLength="1" />
                <input className="input--box" type={textType} value={input[3]} onChange={(event) => { updateInput(event.target.value, 3, event) }} maxLength="1" />
                <input className="input--box" type={textType} value={input[4]} onChange={(event) => { updateInput(event.target.value, 4, event) }} maxLength="1" />
                <input className="input--box" type={textType} value={input[5]} onChange={(event) => { updateInput(event.target.value, 5, event) }} maxLength="1" />
            </form>
            <div className="passwordMode__container">
                <button className="passwordMode__btn" onClick={handlePasswordMode}>Password Mode:</button>
                {textType === "password" ?
                    <span className='text--green '> ON</span>
                    :
                    <span className='text--red '> OFF</span>
                }

            </div>
            <h2>Your Authentication Status:</h2>
            {
                errorOccurred ?
                    <span className='text--red'>There was an error, try again later (Error code:500)</span>
                    :
                    (confirmed ?
                        <span className='text--green'>Valid</span>
                        :
                        <span className='text--red'>Invalid</span>
                    )
            }

        </div>
    );
}

export default InputField;
