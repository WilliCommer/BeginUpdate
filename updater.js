/* 
    Delphi like updater
    
    var update = new Updater(null, () => {
        console.log('update');
    });

    function sub() {
        update.do( () => console.log('sub'));
    }

    update.begin();
    try {
        sub();
    }
    finally {
        update.end();
    }

    expected output:
    > sub
    > update


    - up = new Updater(this, update_function)
    - up.begin() 
    - up.end()
    - up.do( function ) // call function in a block: `try{ up.begin(); func() } finally { up.end(); }`
    - up.do() // triggers an update notification

*/


export default
// modules.export = 

function Updater ( that, update ) {

    var counter = 0;

    update = update.bind(that);

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
                    func = func.bind(that);
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


