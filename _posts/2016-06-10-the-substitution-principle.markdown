---
layout: post
title:  "The L in SOLID"
date:   2016-06-10 09:30:07
categories: Java
---
In Java you have inheritance. For any class, you can create a subclass which has all the same functionality, and then add new methods or overwrite functinality as you wish.

Now, the Java compiler assumes that the subclass can the replace the original class in all instances. We can see this very clearly when we do something like:

```
Object obj;
Sring s1 = new String("blah");
obj = s1;
```

The `String s1` is not a direct instance of the Object class, yet we were able to set the `Object obj` as a String.

In a way, this makes sense. All subclasses of Object will contain the same method signatures as Object, with the same argument lists and same return types. So this implicit upcasting makes sense.

It's not much of a stretch to say that whenever we use a class, we should be able to use a subclass instead without it making a difference to your program. After all, your IDE is already assuming that.

However this is not as obvious as it seems. The classic example for poorly done inheritance is the following:

```
class Rectangle {
    public int width;
    public int height;

    public void setHeight(int h) {
        height = h;
    }

    public void setWidth(int w) {
        width = w;
    }
}

class Square extends Rectangle {

    @Override
    public void setHeight(int h) {
        height = h;
        width = h;
    }

    @Override
    public void setWidth(int w) {
        height = w;
        width = w;
    }
}
```

We have a Rectangle class, and we want to create a Square class. Since a Sqaure IS-A Rectangle, it feel natural to have Square class inherit from Rectangle.

However, notice we've overriden the functionality of the setHeight and setWidth functions. Now, setHeight on the Square instance overwrites both the height and width of the Square. A square is only a square if the height and width are equal.

Now imagine we wrote a series of tests before on Rectangle. For example, one such test could be:

```
@Test
public static ifWidth4AndHeight5_areaIs20 {
    Rectangle r = new Rectangle();
    r.setWidth(4);
    r.setHeight(5);
    assertEquals(r.width * r.height, 20);
}
```

This clearly doesn't work for our Square class. If we substitute the Square class into this example, the code will compile but the test will fail as the area of the Square will be 25. This could cause runtime errors.

One of the core design principles of OOP addresses this. It's called the **Liskov's Substitution Principle**, which says any subclass should be able to replace its parent class in all cases.
