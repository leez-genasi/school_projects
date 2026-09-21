  #include "rules.h"
  #include <iostream>
  
  int main() {
    Rule r1("m --> a,[a]");

    /* use print method of Rule to print this rule */
    r1.print();

    /* write a loop to print out the daughters of this rule in reverse order -- note that 
    Category has its own print method */
    for (int i = r1.dtrs.size() -1; i >=0; i--) {
        r1.dtrs[i].print();
        cout << endl;
    }
    /* verify using are_equal that the first and second daughter of r1 are not equal */
    if (r1.dtrs[0] == r1.dtrs[1]) {
        cout << "First and second daughter are equal\n";
    } else {
        cout << "First and second daughter are not equal\n";
    }

    /* set the terminal attribute of first daughter to true and then verify that 
    daughters are then equal */
    r1.dtrs[0].terminal = true;
    if (r1.dtrs[0] == r1.dtrs[1]) {
        cout << "Daughters are equal\n";
    } else {
        cout << "Daughters are not equal\n";
    }

  }