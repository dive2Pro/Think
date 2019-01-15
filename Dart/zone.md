# 什么是Zone?

在异步执行的函数时, 可以保持当前的环境.

# Timer

```dart
   import 'dart:async';
   // main 默认在 Zone.root 中执行
   main() {
     Timer(new Duration(seconds: 1), () {
      print("1 second");
     } )
   }
   在 Timer 中: 
    factory Timer(duration, callback){
      if (Zone.current == Zone.root) {
        return Zone.current.createTimer(duration, callback);
      }
    }
```

Zone:

```dart
     
```
