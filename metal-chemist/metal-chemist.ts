/**
 *
 * The idea of this kata is to create two classes,
 * {@link Molecule} and {@link Atom}, that will allow you to build numerical equivalents
 * of organic compounds using a set of methods, and to restitute some of their simplest
 * properties( molecular weight and raw formula, for instance). You will need to implement
 * some Exception classes in the process.
 *
 */


export class Molecule {

    /**
     * The value of the molecular weight of the final molecule in g/mol
     * @type {number}
     */
    molecularWeight: number = 0.0
    /**
     *  a list of {@link Atom} objects
     */
    atoms: Atom[] = []

    /**
     * the name of the molecule
     * @type {string}
     */
    name

    id

    constructor(name: any = '') {
        this.name = name
    }

    /**
     * Gives the raw formula of the final molecule
     * @return string
     */
    get formula() {

        return ''
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
        branches.forEach((count, index) => {
            const c = new Carbon(index)
            this.atoms.push(c)
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
     * All numbers are 1-indexed, meaning(1,1,5,3) will bond the first carbon of the first
     * branch with the fifth of the third branch.
     *
     * only positive numbers will be used
     *
     * @param {number[]} branches
     */
    bounder(...branches) {

        return this
    }


    /**
     * [nc,bn,elt]
     * Mutate the carbon number
     *
     * @param {number[][]}  branches
     */
    mutate(...branches) {
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

    }

    add(...ary) {
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
abstract class Atom {
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

    toString() {

    }

    changeElm(elm) {
        this.element = elm
    }

    abstract seal()

    boud(atom: Atom) {
        const index = this.neibouhood.length
        this.neibouhood.push(atom)
        return () => {
            this.neibouhood.splice(index - 1, 1)
        }
    }

    get value() {
        return ValenceNumber[this.element];
    }
}


class Hydrogen extends Atom {
    constructor(id) {
        super("H", id)
    }

    seal() {

    }
}

class Carbon extends Atom {
    constructor(id) {
        super("C", id)
    }

    seal() {
        const hydrogensCount: number = this.value - this.neibouhood.length
        this.hydrogens = new Array(hydrogensCount)
        // @ts-ignore
            .fill(0)
            .map((_, index) => new Hydrogen(index))
        this.seal = () => {
            console.log(' This ')
        }
    }

    minValue() {
        return 2
    }

}
