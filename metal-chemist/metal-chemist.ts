/**
 *
 * The idea of this kata is to create two classes,
 * {@link Molecule} and {@link Atom}, that will allow you to build numerical equivalents
 * of organic compounds using a set of methods, and to restitute some of their simplest
 * properties( molecular weight and raw formula, for instance). You will need to implement
 * some Exception classes in the process.
 *
 */

function sortElement(a: string, b :string) {
    if (a === 'C') {
        return 0
    } else if (b === 'C') {
        return 1
    }

    if(a ==='H') {
        return 0
    } else if( b === 'H') {
        return 1
    }

    if(a ==='O') {
        return 0
    } else if( b === 'O') {
        return 1
    }

    return a.localeCompare(b)
}

function sortAtom(a: Atom, b: Atom) {
    if(a.element === b.element) {
        return a.id - b.id
    } else {
        return sortElement(a.element, b.element)
    }
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
    return atoms.sort((a, b) => sortAtom(a, b))
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

    branches: FillAtom[][] = []

    isSealed : Boolean = false

    constructor(name: any = '') {
        this.name = name
    }

    /**
     * Gives the raw formula of the final molecule
     * @return string
     */
    get formula() {
        if(!this.isSealed) {
            throw new UnlockedMolecule("")
        }
        let elms = {
            C: 0,
            H: 0,
            O: 0
        }

        const forget1 = (elt, num) => {
            return `${elt}${num === 1 ? '' : num}`
        }

        this.branches.forEach(brancher => {
            brancher.forEach(atom => {
                // 这里要处理 add 的情况
                const af = atom.formula
                Object.keys(af).forEach( k => {
                    elms[k] = elms[k] || 0
                    elms[k] += af[k]
                })
            })
        })

        let str = ''
        if (elms.C != 0) {
            str += forget1("C", elms.C)
        }
        delete elms.C
        if (elms.H != 0) {
            str += forget1("H", elms.H)
        }
        delete elms.H

        if (elms.O != 0) {
            str += forget1("O", elms.O)
        }
        delete elms.O

        Object.keys(elms)
            .filter(key => {
                return elms[key] !== 0
            })
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
        this.checkUnSeal()
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
        this.checkUnSeal()
        const self = this
        branches.forEach(([c1, b1, c2, b2]) => {
            const atom1 = self.branches[b1 - 1][c1 - 1]
            const atom2 = self.branches[b2 - 1][c2 - 1]
            if (atom2 === atom1) {
                throw new InvalidBond("No self-bonding")
            }
            atom1.boud(atom2)
            atom2.boud(atom1)
        })
        return this
    }

    checkUnSeal() {
        if(this.isSealed) {
            throw new LockedMolecule("")
        }
    }

    /**
     * [nc,bn,elt]
     * Mutate the carbon number
     *
     * @param {number[][]}  mutations
     */
    mutate(...mutations) {
        this.checkUnSeal()
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
        this.checkUnSeal()
        this.atoms.forEach((atom) => {
            atom.seal()
        })
        this.isSealed = true
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
        const self = this;
        addtions.forEach(([nc, nb, elt]) => {
            const currentBrancher = self.branches[nb - 1]
            const atom = currentBrancher[nc - 1];
            const newAtom = new FillAtom(elt, currentBrancher.length + 1);
            currentBrancher.push(newAtom)
            atom.boud(newAtom)
            newAtom.boud(atom)
//             atom.add(newAtom);
        });
        return this
    }

    /**
     * Don't like add
     *
     * m.add_chaining(2, 5, "C", "C", "C", "Mg", "Br")
     *  will add the chain ...-C-C-C-Mg-Br
     *  to the atom number 2 in the branch 5
     *
     *
     * Special case with add_chaining:
     *  if an error occurs at any point during the building of the chain,
     *  all its atoms have to be removed from the molecule (even the valid ones).
     *
     * @param nc
     * @param nb
     * @param elts
     */
    addChaining(nc: number, nb: number, ...elts : string[]) {
        const self = this
        const currentBranch = self.branches[nb - 1]
        const atom = currentBranch[nc - 1]
        let id = currentBranch.length
        try {
            elts.reduce((p, c) => {
                const nextAtom = new FillAtom(c, ++id);
                p.boud(nextAtom)
                nextAtom.boud(p)
                currentBranch.push(nextAtom)
                return nextAtom
            }, atom)
        } catch(e) {
            console.error(e)
            this.branches = []
        }
        return this
    }

    unlock() {
        this.isSealed = false
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
        return {[this.element]: 1}
    }

    toString() {

        const sortedNeiboudhood = sortAtoms(this.neibouhood)
        console.log(sortedNeiboudhood)
        const atomStr = sortedNeiboudhood
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
        if(this.neibouhood.findIndex( at => at === atom) > -1 ){
            return this
        }
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

    addons: Atom[] = []

    fillForValue() {
        const hydrogensCount: number = this.value - this.addons.length - this.neibouhood.length
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
        if (this.neibouhood.length > this.value) {
            throw new Error('Too much neibouhood elements')
        }
        if (this.neibouhood.length + this.addons.length > this.value) {
            throw new Error(' Too much addons atoms had been added to this atom')
        }

        if (this.neibouhood.length + this.addons.length + this.hydrogens.length > this.value) {
            throw new Error(' Too much addons  had been added to this atom')
        }
    }


    add(atom: Atom) {
        this.addons.push(atom)
        this.fillForValue()
    }

    toString(): string {
        return super.toString();
    }

    get formula() {
        const { element, hydrogens, addons } = this
        const elms = {
            [element]: 1,
        }

        if(elms['H']) {
            elms["H"] += hydrogens.length
        } else {
            elms["H"] = hydrogens.length
        }


        addons.forEach( ({element: atom}) => {
            elms[atom] = elms[atom] || 0
            elms[atom] +=1
        })

        return elms
    }
}

class Carbon extends FillAtom {
    constructor(id) {
        super("C", id)
        this.fillForValue()
    }
}


class InvalidBond extends Error {
    constructor(msg) {
        super(msg)
        this.name = 'Invalid Bond'
    }
}

class UnlockedMolecule extends Error {
    constructor(msg) {
        super(msg)
        this.name = "UnlockedMolecula"
    }
}

class LockedMolecule extends Error {
    constructor(msg) {
        super(msg)
        this.name = "LockedMolecula"
    }
}
