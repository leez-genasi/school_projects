#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include <algorithm>

#include "BUPARSE.h"

using namespace std;

vector<string> words;

void tokenize(string line) {
  /* empty the words vector */
  for(int i = words.size(); i > 0; i--) {
    words.pop_back();
  }

  /* update the words vector from line */
  string::iterator word_itr, space_itr;

  word_itr = line.begin();             /* word_itr is beginning of line */
  space_itr = find(word_itr,line.end(),' '); /* find space */
 
  while(space_itr != line.end()) {
    words.push_back(string(word_itr,space_itr));

    word_itr = space_itr+1;
    space_itr = find(word_itr,line.end(),' '); /* find space */

  }

  words.push_back(string(word_itr,space_itr)); 

}


int main(int argc, char *argv[]) {

  string gname,s;
  if(argc != 2) {
    cout << "usage: td_tester GRAMMAR\n";
    cout << "where GRAMMAR is the filename of a grammar\n";
    exit(0);
  }

  gname = string(argv[1]);
  //Grammar g(gname);
  //g.print();

  BUPARSE parser(gname);

 
  parser.g.print();
  parser.stack_debug=1;

  while(cout << "enter the string to be checked "
 	&& getline(cin,s)) {
    tokenize(s); 
    cout << "input is " << s << endl;

    if(parser.accept(words)) {   
      cout << "yep\n";
    }
    else {
      cout << "nope\n";
    }
  }

  return 0;

}




