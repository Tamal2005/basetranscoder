import React, { useEffect, useState } from 'react'

function Home() {
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState('');
    const [fromFormat, setFromFormat] = useState(1); // Default: Binary
    const [toFormat, setToFormat] = useState(2); // Default: Decimal
    const options = [{ label: "Binary", value: 1 }, { label: "Decimal", value: 2 }, { label: "Hexadecimal", value: 3 }, { label: "Octadecimal", value: 4 }, { label: "ASCII", value: 5 }];
    const [darkTheme, setDarkTheme] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('darkTheme') === 'true';
        setDarkTheme(savedTheme);
        document.body.className = savedTheme ? 'dark' : 'light';
    }, []);

    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
        localStorage.setItem("darkTheme", !darkTheme);
        document.body.className = !darkTheme ? 'dark' : 'light';
    }

    const baseFor = (format) => {
        switch (parseInt(format)) {
            case 1: return 2; // Binary
            case 2: return 10; // Decimal
            case 3: return 16; // Hexadecimal
            case 4: return 8; // Octal
            default: return 10;
        }
    };

    const convertNumber = (number, format) => {
        switch (parseInt(format)) {
            case 1: return number.toString(2); // Binary
            case 2: return number.toString(10); // Decimal
            case 3: return number.toString(16).toUpperCase(); // Hexadecimal
            case 4: return number.toString(8); // Octal
            case 5: return String.fromCharCode(number); // ASCII
            default: return "";
        }
    };

    const splitInput = (input, format) => {
        if (parseInt(format === 1)) {
            // Split binary into 8-bit chunks
            return input.match(/.{1,8}/g) || [];
        }
        return input.split(" "); // Split other formats by space
    };

    const convert = () => {
        try {
            let output = "";

            if (fromFormat === toFormat) {
                // If both formats are the same, return the input value
                output = inputValue;
            } else if (fromFormat === "5" && toFormat !== "5") {
                // ASCII to other formats
                output = inputValue
                    .split("")
                    .map((char) => {
                        let asciiCode = char.charCodeAt(0);
                        return convertNumber(asciiCode, toFormat);
                    })
                    .join(" ");
            } else if (toFormat === "5") {
                // Convert from other formats to ASCII
                const numbers = splitInput(inputValue, fromFormat);
                output = numbers
                    .map((num) => {
                        const parsedNum = parseInt(num, baseFor(fromFormat));
                        return parsedNum >= 32 && parsedNum <= 126 // Valid ASCII range
                            ? String.fromCharCode(parsedNum)
                            : "?"; // Replace invalid codes with "?"
                    })
                    .join("");
            } else {
                // Conversion between non-ASCII formats
                const numbers = splitInput(inputValue, fromFormat);
                output = numbers
                    .map((num) => convertNumber(parseInt(num, baseFor(fromFormat)), toFormat))
                    .join(" ");
            }

            setResult(output);
        } catch (error) {
            setResult("Invalid Input");
        }
    };

    return (
        <div className='body'>
            <header className='header'>
                <p className="logo">BaseTranscoder</p>
                <p className="wrapper">
                    <span className="label">{darkTheme ? 'Dark Mode' : 'Light Mode'}</span>
                    <label className="switch">
                        <input type="checkbox" onChange={toggleTheme} checked={darkTheme} />
                        <span className="slider round"></span>
                    </label>
                </p>
            </header>
            <div className="container input">
                <h2>From:</h2>
                <select className={darkTheme ? 'form-select dark' : 'form-select light'} onChange={(e) => setFromFormat(e.target.value)}>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <textarea className={darkTheme ? 'textarea dark' : 'textarea light'} name="result" rows={10} cols={50} value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder='Enter Your Text Here....'></textarea>
            </div>
            <div className="container output">
                <h2>To:</h2>
                <select className={darkTheme ? 'form-select dark' : 'form-select light'} onChange={(e) => setToFormat(e.target.value)}>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <textarea className={darkTheme ? 'textarea dark' : 'textarea light'} name="result" rows={10} cols={50} value={result} readOnly></textarea>
            </div>
            <button className='convert' onClick={convert}>Convert</button>
        </div>
    )
}

export default Home;
