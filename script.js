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
            })
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
    let nonZeroA;
    let nonZeroB;


    while (notBalanced.length) {
        console.log('equation not balanced');
        // find unbalanced element with least nonzero factors in matrix and balance it

        simpleElement = notBalanced.sort((symbolA, symbolB) => {
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
        )[0]; //assign first sorted element
        console.log(simpleElement);

        notBalanced = equation.isNotBalanced();
        break;
    }
    console.log(equationMatrix);
}

function getEquationMatrix(equation) {
    const elementArray = [...equation.elementSet()];
    const equationMatrix = [];
    let elementFactors = [];
    elementArray.forEach((symbol, elementIndex) => {
        equation.substances.forEach((substance, substanceIndex) => { //TODO make products negative?
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

function test1() {
    let elem1 = new Element('O', 2);
    let elem2 = new Element('H', 2);
    let elem3 = new Element('H', 2);
    let elem4 = new Element('O');

    let subst1 = new Substance([elem1], true);
    let subst2 = new Substance([elem2], true);
    let subst3 = new Substance([elem3, elem4], false);

    let eqn = new Equation([subst1, subst2, subst3]);
    balance(eqn);
}