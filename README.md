# BeginUpdate Method for JavaScript

> Increase performance of batch updates



## What is it good for ?

For example, you have a function `setValue(name, vale)` that will change a value and render the user interface.

```javascript
setValue (name, value) {
	this.values[name] = value;
	this.checkValue();
	this.render();
},
```


That function will be called multiple times in your program and every call will render the UI again. 

```javascript
submit (values) {
	Object.keys.forEach( k => this.setValue( k, values[k]) );
}
```

In JavaScript this problem will usually solved with `debounce` function. If you don't know `debounce`, read [this][debouncearticle]. It is optimal in order to solve the problem of unnecessary changes at a later stage. But you can tackle the problem at the root, with a simple pattern, that came up in the 1990's with [Delphi][delphiarticle] and [Windows][ListBoxBeginUpdateMethod]. 

Before starting a batch update, give a notification with `beginUpdate()` and at the end call `endUpdate()`. The implementation is very simple, `beginUpdate` will increment a counter and `endUpdate` decrement this counter and if it's zero the update function will be called. That's it.

## Simple Updater


```javascript
function Updater ( update ) {
	var counter = 0;
    return {
        begin () { 
            counter += 1; 
        },
        end () { 
            counter -= 1; 
            if (counter = 0) update();
        }
    }
}    
```

It is recommended to use the function in a `try - finally` block, to make sure the counter is zero at the end.

```javascript
const update = new Updater( () => {
	console.log('update');
});
   
update.begin();
try {
	for (let i=0; i < 100; i++) {
    	addItem(i);
  	}
}
finally {
	update.end();
}
```



## Final Updater

My final version provides a function `do()` that calls a function in a `try` block and takes care about binding.



```javascript
function Updater ( update, that ) {
	var counter = 0;
	if (that) update = update.bind(that);

    return {
        
        begin () { 
            return counter += 1; 
        },

        end () { 
            counter -= 1; 
            if (counter <= 0) {
                update();
                return true;
            }
            return false;
        },

        do (func) {
            counter += 1; // begin
            try {
                if (func) {
                    if (that) func = func.bind(that);
                    func();
                }
            }
            finally {
                counter -= 1; // end
                if (counter <= 0) update();
            }
            return counter === 0;
        }
    }
}    
```



## Usage

Example:

```javascript
const testObj = {

	updater: new Updater(this.update, testObj),

	addItem_simple (i) {
		updater.begin();
		try {
			addX(i);
		}
		finally {
			updater.end();
		}
	},

	addItems_do (items) {
		updater.do( () => items.forEach(i => addX(i)) );
	},
	
	addItem_easy (i) {
		addX(i);
		updater.do();
	}
	
	update () {
		renderMe(testObj);
	}
}
```



## References

- [debounce][debouncearticle]
- [Delphi BeginUpdate][delphiarticle]
- [.NET ListBox.BeginUpdate Method][ListBoxBeginUpdateMethod]
- [Apple BeginUpdates][appleBeginUpdates]





<!--- references --->

[debouncearticle]: https://davidwalsh.name/javascript-debounce-function
[ListBoxBeginUpdateMethod]: https://docs.microsoft.com/en-us/dotnet/api/system.windows.forms.listbox.beginupdate?view=netframework-4.8
[delphiarticle]: http://docwiki.embarcadero.com/CodeExamples/Rio/en/BeginUpdate_(Delphi)
[delphiwiki]: https://en.wikipedia.org/wiki/Delphi_(software)
[appleBeginUpdates]: https://developer.apple.com/documentation/uikit/uitableview/1614908-beginupdates







