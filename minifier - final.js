const input = document.getElementById("input");
const output = document.getElementById("output");

//*****************************************************************************************
//  how this works: (PS)
//  name variable - increment name by 1 everytime a new variable is found, and that will
//  be the name of the minified variable. (can also go into the alphanumeric territory to
//  further compress more space/speed up the opening process)
//  
//  remove all comments (// and /**/) - self explanatory
//
//
//
//
//
//
//
//
//*****************************************************************************************

const alphabet = [
    "a", "b", "c", "d", "e", "a", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    "A","B","C","D","E","A","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
    "aA","aB","aC","aD","aE","aA","aF","aG","aH","aI","aJ","aK","aL","aM","aN","aO","aP","aQ","aR","aS","aT","aU","aV","aW","aX","aY","aZ",
];

function minify(text) {
    // parse \n and \r, helps remove comments
    text = text.split(/\n|\r/g);
    // remove both types of comments from every line
    const newtext = [];
    for (let i = 0; i < text.length; i++) {
        //text[i] = text[i].replaceAll("    ", ""); // removes all tabbing (usually 4 or 8 whitespaces)
        const line = text[i];

        const t = [...line.matchAll("//")]; // removes all comments
        if (t.length !== 0) { // if "//" is found
            const quotes = [...line.replaceAll("\\\"", "@@").matchAll("\"")]; // edge case: "//" is if // is in quotes.
            //console.log(quotes.length > 0, i);
            let earliestcomment;
            if (quotes.length > 0) { // if there is any quotes found at all
                allinstances: for (let j = 0; j < t.length; j++) { // instances of "//"
                    for (let k = 0; k < quotes.length; k += 2) { // is it inside any quotes?
                        const p = quotes[k].index;
                        if (t[j].index > p && t[j].index < quotes[k + 1].index) continue allinstances; // if it is, move on to next instance of "//"
                    }
                    earliestcomment = t[j].index; // it is not, so we just found the earliest comment,
                    break;
                }
                //console.log(earliestcomment, "row "+i)
            } else {
                earliestcomment = line.search("//");
                //console.log("row: "+i+":"+earliestcomment);
            }

            if (earliestcomment === 0) continue; // if the entire line is a comment via "//"
            newtext.push(text[i].substring(0, earliestcomment)); // only take the section of the line BEFORE the "//".
            continue;
        }

        if (line.length === 0) continue;

        newtext.push(text[i]);
    }
    text = newtext.join("").split(/"|'/);

    for (let i = 0; i < text.length; i += 2) { // filters using every other space between quotes
        let newtext = text[i];
        newtext = newtext.replaceAll(" === ", "===");
        newtext = newtext.replaceAll(" == ", "==");
        newtext = newtext.replaceAll(" = ", "=");
        newtext = newtext.replaceAll(" != ", "!=");
        newtext = newtext.replaceAll(" !== ", "!==");
        newtext = newtext.replaceAll(" && ", "&&");
        newtext = newtext.replaceAll(" || ", "||");
        newtext = newtext.replaceAll(" > ", ">");
        newtext = newtext.replaceAll(" < ", "<");
        newtext = newtext.replaceAll(", ", ",");
        newtext = newtext.replaceAll(" }", "}");
        newtext = newtext.replaceAll("} ", "}");
        newtext = newtext.replaceAll(" {", "{");
        newtext = newtext.replaceAll("{ ", "{");
        newtext = newtext.replaceAll("; ", ";");
        text[i] = newtext;
    }
    text = text.join("\"");

    const variables = []; // hashtable to save variable names, and assign them a shortened name
    let vcurrent = 0;

    function replacevariables(prefix) {
        text = text.split(prefix + " "); // change variable names
        for (let i = text[0] === "" ? 1 : 0; i < text.length; i++) {
            const t = text[i];
            const variablename = t.substring(0, t.search("="));
            let fetchedname = variables[variablename];
            if (fetchedname === undefined) {
                variables[variablename] = alphabet[vcurrent++];
                fetchedname = variables[variablename];
            }
    
            text[i] = t.replace(variablename, fetchedname);
        }
        text = text.join(prefix + " ");
    }
    replacevariables("const");
    //replacevariables("let");
    //replacevariables("var");
    
    //console.log(text);

    return text;
}

input.addEventListener("change", () => {
    input.files[0].text().then((e) => {
        output.innerText = minify(e);
    });
});