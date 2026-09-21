#include "FSA.h"
#include <iostream>
#include <string>

using namespace std;

int main() {


    FSA f1;
    f1.sep = 0;
    f1.update("me");
    f1.update("my");
    f1.show();
    
    if (f1.accept("me")) {
      cout << "accepts me\n";
    }
    else {
      cout << "rejects me\n";
    }

    if (f1.accept("dy")) {
      cout << "accepts dy\n";
    }
    else {
      cout << "rejects dy\n";
    }

    f1.sep = ' ';
    if (f1.accept("m y")) {
      cout << "accepts m y\n";
    }
    else {
      cout << "rejects m y\n";
    }
}
