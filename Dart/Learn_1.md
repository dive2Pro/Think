# const 
使用`const` 可以标识一个常量, 这个常量可以是 基本类型, 也可以是 class

```dart
 class A {
  final _msg;
  final _index;
  const A(String msg, int index ): _msg = msg, _index = index;
 }
 main() {
   var a1 = const A('', 1);
   var a2 = const A('', 1);
   print(a1 == a2) ; // true 
 }
```

在保证传入的值是一样的前提下, 使用 const 创建的对象他们是等价的, 也就是说指向的是同一个内存地址.


# factory 

```dart
  abstract class A {
    factory A () {
      return new B()
    }
  }
  
  //class B extends A {
  class B --extends-- implement A {
  
  }
```

此时编译器会报错 `error: The generative constructor 'A() → A' expected, but factory found. (non_generative_constructor at index.dart:33)`;
*这时是语法使用错误, 应该用 implement 替换 extends*, 此时 可以这样使用 A:

```dart
  main(){
    A a = new A();
    print(a); // instanceOf b ;
  }
``

