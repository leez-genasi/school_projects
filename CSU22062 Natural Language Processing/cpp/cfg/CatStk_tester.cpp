    #include "rules.h"
    #include "CatStk.h"
    #include <iostream>
      
    int main() {
    Rule r1("m --> a,[a]");

    CatStk stk;

    /* push the daughters of r1 onto stk, pushing the last daughter first */
    for (int i = r1.dtrs.size() -1; i >=0; i--) {
        stk.push(r1.dtrs[i]);
    }

    /*   then print the contents of stk -- CatStk has its own print method */
    stk.print();

    /*  then empty out stk */
    for (int i = r1.dtrs.size() - 1; i >=0; i--) {
        stk.pop();
    }

    /* push the daughters of r1 onto stk, pushing the first daughter first */
    for (int i = 0; i < r1.dtrs.size(); i++){
        stk.push(r1.dtrs[i]);
    }

    /*   then print the contents of stk */
    stk.print();
    }

