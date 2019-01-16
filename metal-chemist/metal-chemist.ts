/**
 *
 * The idea of this kata is to create two classes,
 * {@link Molecule} and {@link Atom}, that will allow you to build numerical equivalents
 * of organic compounds using a set of methods, and to restitute some of their simplest
 * properties( molecular weight and raw formula, for instance). You will need to implement
 * some Exception classes in the process.
 *
 */

function sortElement(a, b) {
    if (a === 'C' && b === 'C') {
        return a.id - b.id
    } else if (a === 'C') {
        return 0
    } else if (b === 'C') {
        return 1
    }

    if (a.length > b.length) {
        return 1
    } else if (a.length < b.length) {
        return 0
    }
    return a.localeCompare(b)
}

/**
 *
 * {@link https://chemistry.stackexchange.com/questions/1239/order-of-elements-in-a-formula}
 *
 * This is the system of writing chemical formulas.
 *
 * In this system the carbon atoms are first,
 *
 * then hydrogen atoms and then other in alphabetical order.
 *
 * @param {Atom[]} atoms
 */
function sortAtoms(atoms) {
    // atoms.filter( atom => atom.element === 'C')
    return atoms.sort((a, b) => sortElement(a.element, b.element))
}

export class Molecule {

    /**
     * The value of the molecular weight of the final molecule in g/mol
     * @type {number}
     */
    get molecularWeight() {
        let weight = 0.0;
        this.branches.forEach(brancher => {
            brancher.forEach(atom => {
                weight += atom.weight
            })
        })
        return weight
    }

    /**
     *  a list of {@link Atom} objects
     */
    get atoms() {
        let atoms_ = []
        this.branches.forEach(branches => {
            branches.forEach(atom => {
                atoms_.push(atom)
                atoms_ = atoms_.concat(atom.hydrogens);
            })
        })
        return atoms_
    }

    /**
     * the name of the molecule
     * @type {string}
     */
    name

    id

    branches: FillAtom[][] = []

    constructor(name: any = '') {
        this.name = name
    }

    /**
     * Gives the raw formula of the final molecule
     * @return string
     */
    get formula() {
        let elms = {
            C: 0,
            H: 0
        }

        const forget1 = (elt, num) => {
            return `${elt}${num === 1 ? '' : num}`
        }

        this.branches.forEach(brancher => {
            brancher.forEach(atom => {
                const [element, hydrogens] = atom.formula
                elms[element] = elms[element] ? elms[element] + 1 : 1
                elms.H += hydrogens
            })
        })
        let str = ''

        str += forget1("C", elms.C)
        delete elms.C
        Object.keys(elms)
            .sort((a, b) => sortElement(a, b))
            .forEach(elm => {
                str += forget1(elm, elms[elm])
            })

        return str
    }

    /**
     *
     * Add new "branches" of "carbons", linked together, to the current molecule
     *
     *
     * Each argument correspond to the number of carbons of one branch
     *
     * All branches have to be created in the provider order
     * @param branches
     */
    brancher(...branches: number[]) {
        const self = this
        let id = 1;

        function bondBranchCarbon(atoms: Atom[]) {
            atoms.forEach((atom, index) => {
                if (index === 0) {
                    atom.boud(atoms[index + 1])
                } else if (index === atoms.length - 1) {
                    atom.boud(atoms[index - 1])
                } else {
                    atom.boud(atoms[index - 1])
                    atom.boud(atoms[index + 1])
                }
            })
        }

        branches.forEach((count, index) => {
            self.branches[index] = self.branches[index] || []
            for (let i = 0; i < count; i++) {
                const c = new Carbon(id++)
                self.branches[index].push(c)
            }
            if (count > 1) {
                bondBranchCarbon(self.branches[index])
            }
        })

        return this
    }

    /**
     * Create new bounds between two atoms of already existing branches
     * Each argument is tuple of four integers giving:
     * [c1, b1, c2, b2]
     *  - c1 & b1: carbon and branch number of the first tom
     *  - c2 & b2: carbon and branch number of the second atom
     *
     * All numbers are 1-indexed,
     * meaning(1,1,5,3) will bond the
     *
     *        first carbon of the first branch
     *        with the
     *        fifth carbon of the third branch.
     *
     * only positive numbers will be used
     *
     * @param {number[]} branches
     */
    bounder(...branches) {
        const self = this
        branches.forEach(([c1, b1, c2, b2]) => {
            const atom1 = self.branches[b1 - 1][c1 - 1]
            const atom2 = self.branches[b2 - 1][c2 - 1]
            if(atom2 === atom1) {
                throw new InvalidBond("No self-bonding")
            }
            atom1.boud(atom2)
            atom2.boud(atom1)
        })
        return this
    }


    /**
     * [nc,bn,elt]
     * Mutate the carbon number
     *
     * @param {number[][]}  branches
     */
    mutate(...mutations) {
        const self = this
        mutations.forEach(([nc, nb, elt]) => {
            const atom = self.branches[nb - 1][nc - 1]
            atom.mutate(elt)
            atom.fillForValue()
        })
        return this
    }

    /**
     *  Finalize the molecule instance, adding missing hydrogens everywhere
     *  and locking the object
     */
    closer() {
        this.atoms.forEach((atom) => {
            atom.seal()
        })
        return this
    }

    /**
     *
     * element1id: element1, bounded to the current Atom and its id number. Do not display
     * id number that hydrogen Atom to increase readability
     *
     * @return string - Atom(element.id: element1id, element2id...)
     *                - 'Atom(C.1: C2, C2, C6, H)'
     */
    toString() {
        let strAry = []
        this.branches.forEach(b => {
            strAry = strAry.concat(
                sortAtoms(b.filter(item => item.element !== 'H'))
                    .map(atom => {
                        return atom.toString()
                    }))
        })

        return strAry.join(",")
    }

    // TODO:
    /**
     *
     * @param  {(number|string)[]}addtions
     */
    add(...addtions) {
        const self = this
        addtions.forEach(([nc, nb, elt]) => {
            const atom =  self.branches[nb - 1] [nc - 1]
            const newAtom = new Atom(elt, atom.hydrogens.length)
            atom.boud(newAtom)
        })
        return this
    }
}


const ValenceNumber = {
    "H": 1,
    B: 3,
    C: 4,
    N: 3,
    O: 2,
    F: 1,
    "Mg": 2,
    P: 3,
    S: 2,
    "Cl": 1,
    "Br": 1
}

const AtomicWeight = {
    "H": 1.0,
    B: 10.8,
    C: 12.0,
    N: 14.0,
    O: 16.0,
    F: 19.0,
    "Mg": 24.3,
    P: 31.0,
    S: 32.1,
    "Cl": 35.5,
    "Br": 80.0
}

/**
 * Instances of this class represent atoms in a specific Molecule instance
 * and the bounds they hold with other atom instances
 */
class Atom {
    /**
     * The chemical symbol
     * @type {string}
     */
    element

    /**
     * An integer that allows to keep track of all the atoms of the same molecule,
     * beginning with 1 (step of one for any new Atom instance)
     *
     * @type {number}
     */
    id

    neibouhood: Atom[] = []

    hydrogens: Hydrogen[] = []

    constructor(elm, id) {
        this.element = elm
        this.id = id
    }

    get formula() {
        return this.element
    }


    toString() {
        const atomStr =
            sortAtoms(this.neibouhood)
                .map(atom => {
                    return `${atom.element}${atom.id}`
                })
                .concat(
                    this.hydrogens.map(atom => atom.element)
                )
                .join(",")
        return `Atom(${this.element}.${this.id}: ${atomStr})`
    }

    changeElm(elm) {
        this.element = elm
    }

    seal() {
    }

    boud(atom: Atom) {
        const index = this.neibouhood.length
        this.neibouhood.push(atom)
        this.neibouhood = this.neibouhood.sort((a, b) => {
            return a.id - b.id
        })
        return this
    }

    mutate(elt) {
        this.element = elt
    }

    get value() {
        return ValenceNumber[this.element];
    }

    get weight() {
        return AtomicWeight[this.element] + this.hydrogens.length
    }
}


class Hydrogen extends Atom {
    constructor(id) {
        super("H", id)
    }
}


class FillAtom extends Atom {

    fillForValue() {
        const hydrogensCount: number = this.value - this.neibouhood.length
        this.hydrogens = new Array(hydrogensCount)
        // @ts-ignore
            .fill(0)
            .map((_, index) => {
                return new Hydrogen(index + 1 + this.id).boud(this)
            })
    }

    boud(atom) {
        const back = super.boud(atom)
        this.fillForValue();
        return back
    }

    seal() {
        if(this.neibouhood.length > this.value) {
            throw new Error('Too much neibouhood elements')
        }
        if(this.neibouhood.length + this.hydrogens.length > this.value) {
            throw new Error(' Too much hydrogens had been added to this atom')
        }
    }
}

class Carbon extends FillAtom {
    constructor(id) {
        super("C", id)
        this.fillForValue()
    }


    get formula() {
        return [this.element, this.hydrogens.length]
    }

    minValue() {
        return 2
    }

}


class InvalidBond extends Error {
    constructor(msg) {
        super(msg)
        this.name = 'Invalid Bond'
    }
}
