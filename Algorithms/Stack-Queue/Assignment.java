import java.util.*;


class Node<Item> {
    Item item;
    Node<Item> prev;
    Node<Item> next;

    public Node(Item i) {
        item = i;
    }


    public Item getItem() {
        return item;
    }

    public Node<Item> getNext() {
        return next;
    }

    public Node<Item> getPrev() {
        return prev;
    }

    public void setNext(Node<Item> next) {
        this.next = next;
    }

    public void setPrev(Node<Item> prev) {
        this.prev = prev;
    }
}

/**
 * Write a generic data type for a deque and a randomized queue.
 * The goal of this to implements elementary data structure using arrays and linked lists,
 *
 * @param <Item>
 */
public class Deque<Item> implements Iterable<Item> {
    Node<Item> head;
    Node<Item> bail;
    int size;

    public Deque() {
        size = 0;
    }

    public boolean isEmpty() {
        return size() == 0;
    }

    public int size() {
        return size;
    }

    public void addFirst(Item item) throws IllegalArgumentException {
        if (item == null) {
            throw new IllegalArgumentException();
        }
        if (head == null) {
            head = new Node<>(item);
            bail = head;
        } else {
            Node<Item> newOne = new Node<>(item);
            head.setPrev(newOne);
            newOne.setNext(head);
            head = newOne;
        }
        size++;
    }

    public void addLast(Item item) throws IllegalArgumentException {
        if (item == null) {
            throw new IllegalArgumentException();
        }
        if (bail == null) {
            bail = new Node<>(item);
            head = bail;
        } else {
            Node<Item> newOne = new Node<>(item);
            bail.setNext(newOne);
            newOne.setPrev(bail);
            bail = newOne;
        }
        size++;
    }

    public Item removeFirst() throws NoSuchElementException {
        if (isEmpty()) {
            throw new NoSuchElementException();
        }
        Node<Item> prevHead = head;
        head = head.getNext();
        size--;
        return prevHead.getItem();
    }

    public Item removeLast() throws NoSuchElementException {
        if (isEmpty()) {
            throw new NoSuchElementException();
        }

        Node<Item> prevBail = bail;
        bail = bail.getPrev();
        bail.setNext(null);
        size--;
        return prevBail.getItem();
    }

    Node<Item> copyHead;

    @Override
    public Iterator<Item> iterator() {
        copyHead = head;
        return new Iterator<Item>() {
            @Override
            public boolean hasNext() {
//                System.out.println("Has Next");
                return copyHead != null;
            }

            @Override
            public Item next() {
//                System.out.println("I am Next");
                Item item = copyHead.getItem();
                copyHead = copyHead.getNext();
                return item;
            }
        };
    }


    public static void main(String[] args) {
        Deque<String> dq = new Deque<>();
        dq.addFirst("asd");
        dq.addFirst("qwe");
        for (Iterator<String> it = dq.iterator(); it.hasNext(); ) {
            String i = it.next();
            System.out.println(i);
        }
        dq.addLast("Last");
        dq.removeLast();
        dq.removeFirst();

        for (Iterator<String> it = dq.iterator(); it.hasNext(); ) {
            String i = it.next();
            System.out.println(i);
        }
        dq.removeLast();
        for (Iterator<String> it = dq.iterator(); it.hasNext(); ) {
            String i = it.next();
            System.out.println(i);
        }
        dq.addLast(null);
        dq.removeLast();
    }
}


class RandomizedQueue<Item> extends Deque<Item>{
    Random random;
    public RandomizedQueue() {
        super();
        random = new Random();
    }
    public Item dequeue(Item item){
        Node<Item> willRemoveNode = nextRandomNode();
        Node<Item> willRemoveNodePrev = willRemoveNode.getPrev();
        Node<Item> willRemoveNodeNext = willRemoveNode.getNext();
        willRemoveNodePrev.setNext(willRemoveNodeNext);
        willRemoveNodeNext.setPrev(willRemoveNodePrev);
        return willRemoveNode.getItem();
    }

    public Item sample() {
        return nextRandomNode().getItem();
    }

    public void enqueue(Item item) {
        addLast(item);
    }

    @Override
    public Iterator<Item> iterator() {
        List<Integer> list = new ArrayList<>();
        for (int i = 0; i < size(); i++) {
            list.add(i);
        }
        Collections.shuffle(list);
        return new Iterator<Item>() {
            @Override
            public boolean hasNext() {
                return list.size() > 0;
            }

            @Override
            public Item next() {
                int index = list.remove(0);
                 return specificNode(index).getItem();
            }
        };
    }
    private int nextRandomIndex() {

        return random.nextInt(size());
    }
    private Node<Item> specificNode(int index) {
        int i = 0;
        Node<Item> copyHead = head;
        while(i++ < index) {
            copyHead = copyHead.getNext();
        }
        return copyHead;
    }
    private Node<Item> nextRandomNode() {
        int nextIndex = nextRandomIndex();
        return specificNode(nextIndex);
    }
    public static void main(String[] args) {
        RandomizedQueue<String> rq = new RandomizedQueue<>();
        rq.enqueue("1");
        rq.enqueue("2");
        rq.enqueue("3");
        rq.enqueue("4");
        for (Iterator<String> it = rq.iterator(); it.hasNext(); ) {
            String i = it.next();
            System.out.println(i);
        }
    }
}
