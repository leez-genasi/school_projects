#include "FSA.h"
#include <fstream>
#include <stdlib.h>

FSA::FSA() {
  NodePtr n;
  n = new Node;
  n->initial = true;
  initial_states.push_back(n);
}

void FSA::show() {
  for(NodePtr n : initial_states) {
    n->show();
  }
}

void FSA::dot_show() {
  ofstream f;
  // makes filename /tmp/bloggs_parse.dot
  // prints dot prologue
  string personal_fsa(getenv("LOGNAME"));
  personal_fsa = "/tmp/" + personal_fsa + "_fsa";
  string dot_file;
  dot_file = personal_fsa + ".dot";
  f.open(dot_file);
 
  f << "digraph G {\n";
  f << "center=true;";
  for(NodePtr n : initial_states) {
    n->show(f);
  }
  f << "};";
  f.close();
  string dot_command;
  dot_command = "dot -Tps " + dot_file + " -o " + personal_fsa + ".ps";
  system(dot_command.c_str());
  string ghost_command;
  // temp fix for lab machine's which do not have their own gv
  // ghost_command = "/shared/teaching/CSLL/2CSLL3/IntelBin/gv " + personal_fsa + ".ps";
  ghost_command = "gv " + personal_fsa + ".ps";
  system(ghost_command.c_str());


}

bool FSA::accept(string input) {
  set_key_from_string(input);
  return accept();
}

bool FSA::accept() {

  int k = 0;
  bool accept = false;

  NodePtr n1, n2;
  
  for(int count = 0; count < initial_states.size(); count++) {
    n1 = initial_states[count];
    /* k records how much of the key has been seen so far */
    for (k = 0; k < key.size(); k++) {
      if ((n2 = n1->match(key[k])) != nullptr) {
       n1 = n2;
      }
       else {
	break; /* jump out of main loop */
       }
    }

    if (k == key.size() && n1->accept) {
      accept = true;
      break;
    }

  }
  return accept;
}

/*! sets key from input 
 *  if not already accepted adds nodes to allow it to be accepted
 */
void FSA::update(string input) {
  /* make key from input */
  set_key_from_string(input);

  int k = 0;
  bool matching = true;
  NodePtr n1, n2;

  if (accept()) {
    return;
  }

  /* CODE INCOMPLETE */
  
}


/* splits input up setting the vector key to contain the pieces
 * the value of sep determines where to split
 * if sep is 0 then each letter is a separate element
 * if sep is ' ' then splits on white space
 */
void FSA::set_key_from_string(string input) {
  int start = 0, finish;
  int ends_on_sep = 0;
  key.resize(0);
  if (sep != 0) {
    while((finish = input.find(sep,start)) != string::npos) {
      key.push_back(input.substr(start,finish-start));
      if(finish == input.length()-1) {
       ends_on_sep = 1;
       break;
      }
      else {
      finish++;
      start = finish;
      }
    }

    if (ends_on_sep == 1) {}
    else {
      key.push_back(input.substr(start));
    }
  }

  else {
    for (start = 0; start < input.length(); start++) {
      key.push_back(input.substr(start,1));
    }
  }

}