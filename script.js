class Element {
    constructor(symbol, subscript = 1) {
        this.symbol = symbol;
        this.subscript = subscript;
    }
}

class Substance {
    constructor(elements, isReactant, coefficient = 1) {
        this.elements = elements;
        this.isReactant = isReactant;
        this.coefficient = coefficient;
    }
    countAtoms(element) { 
        let sum = 0;
        Array.from(this.elements).forEach(elem => {
            if (elem.symbol == element) sum += elem.subscript * this.coefficient;
        });
        return sum;
    }
}

class Equation {
    constructor(substances) {
        this.substances = substances
        this.setOfElements = this.elementSet()
    }
    elementSet() {
        const rctsSet = new Set();
        const prodSet = new Set();
        Array.from(this.substances).forEach(substance => {
            if (substance.isReactant) {
                substance.elements.forEach(element => rctsSet.add(element.symbol));
            }
            else substance.elements.forEach(element => prodSet.add(element.symbol));
        });
        if (this.setsAreEqual(rctsSet, prodSet)) return rctsSet;
        else {
            console.log('not same reactancts and products');
            return false;
        }
    }
    setsAreEqual(r, p) {
        if (r.size !== p.size) {
            return false;
        }
        return Array.from(r).every(element => {
            return p.has(element);
        });
    }
    isNotBalanced() {
        let notBalanced = [];
        Array.from(this.setOfElements).forEach(symbol => {
            let sumReactants = 0;
            let sumProducts = 0;
            Array.from(this.substances).forEach(substance => {
                if (substance.isReactant) sumReactants += substance.countAtoms(symbol);
                else sumProducts += substance.countAtoms(symbol);
            });
            if (sumReactants != sumProducts) notBalanced.push(symbol);
        })
        return notBalanced;
    }
}

function balance(equation) {
    //TODO finish
    const elementArray = [...equation.elementSet()]; //set should preserve insertion order
    const equationMatrix = getEquationMatrix(equation);
    let notBalanced = equation.isNotBalanced();
    let sumReactants = 0;
    let sumProducts = 0;
    let reactantsLow = true;
    let inSubst = false;
    let balSubstance;
    let simpElemSubsc;
    let simpleElement;

    let counter = 0;
    let coefficients = [];

    while (notBalanced.length) {
        sumReactants = 0;
        sumProducts = 0;
        simpleElement = getSimpleElement(notBalanced, equationMatrix, elementArray)
        
        // Count reactants and products for simple element
        Array.from(equation.substances).forEach(substance => {
            if (substance.isReactant) sumReactants += substance.countAtoms(simpleElement);
            else sumProducts += substance.countAtoms(simpleElement);
        });

        reactantsLow = sumReactants < sumProducts;

        // Find substance to balance
        balSubstance = Array.from(equation.substances).filter(subst => {
            inSubst = false;
            subst.elements.forEach(elem => {if (elem.symbol == simpleElement) {inSubst = true}});
            return (inSubst && (subst.isReactant == reactantsLow));
        }).sort((a, b) => {
            if (a.elements.length < b.elements.length) return -1; 
            else if (a.elements.length > b.elements.length) return 1;
            else return 0;
        })[0];        
        
        balSubstance.elements.forEach(element => {
            if (element.symbol == simpleElement) simpElemSubsc = element.subscript;
        });
        balSubstance.coefficient += Math.abs(sumReactants - sumProducts)/simpElemSubsc;


        equation.substances.forEach(substance => coefficients.push(substance.coefficient));
        console.log(coefficients);
        coefficients.length = 0;
        notBalanced = equation.isNotBalanced();

        // Safety valve:
        if (counter > 30) break;
        counter++;
    }


    //after balancing, check for whole number coefficients
    //if not whole numbers, find factor to multiply up
    console.log('equation after balancing ')
    console.log(equation);
}

function getEquationMatrix(equation) {
    const elementArray = [...equation.elementSet()];
    const equationMatrix = [];
    let elementFactors = [];
    elementArray.forEach((symbol) => { //fix unused names
        equation.substances.forEach((substance) => {
            elementFactors.push(substance.countAtoms(symbol));
        });
        equationMatrix.push(elementFactors);
        elementFactors = [];
    });
    return equationMatrix;
}

function getSimpleElement(notBalanced, equationMatrix, elementArray) {
    let nonZeroA = 0;
    let nonZeroB = 0;
    return notBalanced.sort((symbolA, symbolB) => {
        nonZeroA = 0;
        nonZeroB = 0;
        equationMatrix[elementArray.indexOf(symbolA)].forEach(factor => {
            if (factor) nonZeroA++;
        });
        equationMatrix[elementArray.indexOf(symbolB)].forEach(factor => {
            if (factor) nonZeroB++;
        });
        if (nonZeroA < nonZeroB) return -1;
        else if (nonZeroA > nonZeroB) return 1; 
        else return 0;
    }
    )[0]; //assign first sorted element as simplest
}

function resetCoefficients(substances) {
    substances.forEach(substance => substance.coefficient = 1);
}

function test1() {
    let O2 = new Element('O', 2);
    let O1 = new Element('O');

    let H2 = new Element('H', 2);
    let C3 = new Element('C', 3);
    let C2 = new Element('C', 2);

    let H8 = new Element('H', 8);
    let H6 = new Element('H', 6);

    let C1 = new Element('C', 1);

    let oxygenR = new Substance([O2], true);
    let hydrogenR = new Substance([H2], true);
    let waterP = new Substance([H2, O1], false);
    let propaneR = new Substance([C3, H8], true);
    let ethaneR = new Substance([C2, H6], true);
    let carbonDioxideP = new Substance([C1, O2], false);

    let waterSynthesis = new Equation([oxygenR, hydrogenR, waterP]);
    let propaneCombustion = new Equation([propaneR, oxygenR, carbonDioxideP, waterP]);
    let ethaneCombustion = new Equation([ethaneR, oxygenR, carbonDioxideP, waterP]);


    balance(waterSynthesis);
    resetCoefficients(propaneCombustion.substances);
    balance(propaneCombustion);

    resetCoefficients(ethaneCombustion.substances);
    balance(ethaneCombustion);
}

// test2 ethane combustion
// test3 iron oxidation