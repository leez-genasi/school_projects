#include "FSA.h"
#include <iostream>
#include <string>

/* this will show a picture of the network after each word has been added */
/* need to type 'q' in the ghostview browser window to kill the display   */
/* and allow the code to continue adding words */

using namespace std;

int main() {


    FSA f1;
    f1.sep = 0;
     f1.update("me");
     f1.dot_show();
     f1.update("my");
     f1.dot_show();
     f1.update("do");
     f1.dot_show();
     f1.update("day");
     f1.dot_show();

}
