const fs = require('fs')

const args = process.argv

let filename = args[2]
let output = args[3]
let title = args[4]

function dothing(input) {
    let tokens = []
    let curstr = ''
    let data = input.split("") //data from the goonies
    for (x = 0; x < data.length; x++) {
        curstr += data[x]

        
        if (curstr.toLowerCase() == 'header:') {
            tokens.push("header")
            curstr = ''

        }
        else if (curstr == '\n' || curstr == '\r' || curstr == ' ' || curstr == '\t') {
            curstr = ''
        }

        else if (curstr.endsWith(';')) {
            tokens.push(curstr.replace(';', ''))
            curstr = ''
        }
        

        else if (curstr.toLowerCase() == 'image:') {
            tokens.push("image")
            curstr = ''
        }
        else if (curstr.toLowerCase() == 'link:') {
            tokens.push("link")
            curstr = ''
        }
        else if (curstr.toLowerCase() == 'linktext:') {
            tokens.push("linktext")
            curstr = ''
        }
        else if (curstr.toLowerCase() == 'text:') {
            tokens.push("text")
            curstr = ''
        }
        else if (curstr.toLowerCase() == 'video:') {
            tokens.push("video")
            curstr = ''
        }
        else if (curstr.toLowerCase() == 'tag:') {
            tokens.push("tag")
            curstr = ''
        }
        
        

    }  
    return tokens
}

function parse(input) {
    let i = 0
    let htmltoks = []
    let tokstring = ''
    while (i < input.length) {
        if (input[i] == 'header') {
            htmltoks.push(`<h1> ${input[i + 1]} </h1>`)
            i++
        }
        else if (input[i] == 'image') {
            htmltoks.push(`<img src=${input[i + 1]}> </img>`)
            i++
        }
        else if (input[i] == 'link') {
            let href = input[i + 1]
            let text = ''
            if (input[i + 2] == 'linktext') {
                text = input[i + 3]
            }
            htmltoks.push(`<a href=${href}>${text}</a>`) //dunno why but this took ages to solve
            i++
            i++
            i++
            
        }
        else if (input[i] == 'text') {
            htmltoks.push(`<p> ${input[i + 1]} </p>`)
            i++
        }
        else if (input[i] == 'tag') {
            htmltoks.push(input[i + 1])
            i++
        }
        i++
    }
    //converts all of tokens into one string
    for (x = 0; x < htmltoks.length; x++) {
        tokstring += htmltoks[x] + '\n'
    }
    return tokstring

}

function write(parse, out, name) {
    fs.writeFile(out, `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>${name}</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        ${parse}
    </body>
    </html>`, err => {
        if (err) {
            console.log(err)
        }
    }
    
    )
}

fs.readFile(filename, "utf8", (err, data ) => {
    if (err) {
        console.log("Error reading file")
        return
    }
    let lex = dothing(data)
    let parseer = parse(lex)
    write(parseer, output, title)

})

