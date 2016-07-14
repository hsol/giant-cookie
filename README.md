# giant-cookie
Makes available a cookie larger

This library methods are based on [jquery.cookie](https://github.com/carhartl/jquery-cookie).

　

**Init giant-cookie**

    var giantCookie = new GiantCookie();

**Set Cookie**

    giantCookie.cookie((*String*) key, (*Object* or *String*) value, (*Object*) option);

**Get Cookie**

    giantCookie.cookie((*String*) key);

**Remove Cookie**

    giantCookie.removeCookie((*String*) key);

　

**Options**

    {json : (*boolean*), max : (*integer*),  expires: (*integer* or *date*), path : (*String*), domain : (*String*), secure : (*boolean*)}

> **json**

> If you want to save object to cookie with json stringify automatically, set true.

> **max**

> Set you maximum string byte.

> **expires**

> expires for cookie.

> **path**

> path for cookie.

> **domain**

> domain for cookie.

> **secure**

> ssl for cookie when you use https protocol.

　

Copyright 2016. [HansolLim](http://hsol.github.io) all rights reserved.
