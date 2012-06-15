ShowSrc
=======

If you need to show the source of a script you've included in your page, but
didn't know where to turn, now you do!

Demo
----

Sure, why not. http://dave-irvine.github.com/ShowSrc/

Click the button. Enjoy.

Usage
-----

Include showsrc.js on your page, then call ```showSrc()``` when your page is
finished loading.

ShowSrc will search your document body for any script tags, and check if they
have a ```data-showsrc``` attribute. If they do, ShowSrc will download the
source code for that script tag, and then append a hidden ```pre`` after the
script (including a prettyprint class), along with a "Show Source" button.

The button automatically gets a click handler that will allow you to toggle
the visibility of the ```pre``` element.

You can also pass a callback to ```showSrc()``` that will be called after all
relevant scripts have been downloaded and appended to the document. You could
maybe use this to run prettyprint if you like.


Compatibility
-------------

Sorry, this is a super fast hack-n-slash. I highly doubt it'll work in IE.
