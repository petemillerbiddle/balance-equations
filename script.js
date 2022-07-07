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
    let sumReactants;
    let sumProducts;
    let reactantsLow; //boolean
    let inSubst = false;
    let balSubstance;



    while (notBalanced.length) {
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
            if (a.elements.length < b.elements.length) return -1; // !convert to array if error!
            else if (a.elements.length > b.elements.length) return 1;
            else return 0;
        })[0];        
        
        console.log('balSubstance:')
        console.log(balSubstance); //FIX: logs as undefined
        // TODO finish below
        // incrSubst.coefficient += Math.abs(sumReactants -sumProducts)/incrSubst.elements[]
        // new multSubst coefficient += difference in Rct, prod side, divided by subscript
        //Balance simple element
        //TODO start with side of rxn w/ fewer factors?
        //Find number of atoms on each side
        //multiply up substance with fewest elements on...
        //  side with fewer atoms to equal larger side

        notBalanced = equation.isNotBalanced();
        console.log(notBalanced);
        break;
    }
    //after balancing, check for whole number coefficients
    //if not whole numbers, find factor to multiply up
    console.log(equationMatrix);
}

function getEquationMatrix(equation) {
    const elementArray = [...equation.elementSet()];
    const equationMatrix = [];
    let elementFactors = [];
    elementArray.forEach((symbol, elementIndex) => { //fix unused names
        equation.substances.forEach((substance, substanceIndex) => {
            if (equation.substances[substanceIndex].isReactant) {
                elementFactors.push(equation.substances[substanceIndex].countAtoms(symbol));
            }
            else elementFactors.push(-1 * equation.substances[substanceIndex].countAtoms(symbol)); 
        });
        equationMatrix.push(elementFactors);
        elementFactors = [];
    });
    return equationMatrix;
}

function getSimpleElement(notBalanced, equationMatrix, elementArray) {
    let nonZeroA;
    let nonZeroB;
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

function test1() {
    let O2 = new Element('O', 2);
    let H2 = new Element('H', 2);
    let O1 = new Element('O');
    let C3 = new Element('C', 3);
    let H8 = new Element('H', 8);
    let C1 = new Element('C', 1);

    let oxygenR = new Substance([O2], true);
    let hydrogenR = new Substance([H2], true);
    let waterP = new Substance([H2, O1], false);
    let propaneR = new Substance([C3, H8], true);
    let carbonDioxideP = new Substance([C1, O2], false);

    let waterSynthesis = new Equation([oxygenR, hydrogenR, waterP]);
    let propaneCombustion = new Equation([propaneR, oxygenR, carbonDioxideP, waterP]);


    balance(waterSynthesis);
    balance(propaneCombustion);
}

// test2 ethane combustion
// test3 iron oxidation