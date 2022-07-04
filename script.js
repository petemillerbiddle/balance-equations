class Substance {
    constructor(element, subscript, isReactant, coefficient = 1) {
        this.element = element;
        this.subscript = subscript;
        this.isReactant = isReactant;
        this.coefficient = coefficient;
    }
}


let reactant1 = new Substance('O', 2, true);
console.log(reactant1);
