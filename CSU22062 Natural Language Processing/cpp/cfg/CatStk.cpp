/* implementation CatStk stack on top of vector class */
#include "CatStk.h"
#include <iostream>

CatStk::CatStk() {
  _stk.clear();
  print_top_at_left = true;
#if DEBUG 
  cout << "calling CatStk constructor\n";
#endif

}

CatStk::~CatStk(){
#if DEBUG 
  cout << "calling CatStk destructor\n";
#endif
}


/*! adds to the top of stack */
void CatStk::push(Category x) { /* use push_back method of vector */
  _stk.push_back(x);
}

/*! removes the top of the stack and returns it */
Category CatStk::pop() { /* use back and pop_back method of vector */
  Category c;
  c = _stk.back();
  _stk.pop_back();
  return c;
}


/*! verifies that the stack is empty */
bool CatStk::is_empty() {
  return _stk.empty();
}

/*! returns the top of the stack without removing it */
Category CatStk::top() { 
   return _stk.back();

}

/*! displays the contents left to write or right to left 
 * according to print_top_at_left
 */ 
void CatStk::print() {
  if(print_top_at_left) {
    for (int i = _stk.size(); i > 0; i--) {
      _stk[i-1].print();
      cout << ' ';
    }
    cout << endl;
  }
  else {
    for (unsigned int i = 0; i < _stk.size(); i++) {
      _stk[i].print();
      cout << ' ';
    }

  }
}

/*! used by shift/reduce parser, dtrs will be r.dtrs of some Rule r
 * checks that top elements of stack corresponds to dtrs in reverse 
 * order
 *
 * so last dtr is top of stack etc
 */
bool CatStk::dtrs_match(vector<Category> dtrs) {
  int n = _stk.size();
  bool match = true;   /* true if dtrs matches top of _stk */
  
  for(int i = dtrs.size(); i > 0; i--) {
    if (n == 0) {
      match = false;
      break;
    }
    else if(are_equal(_stk[n-1],dtrs[i-1])) {
      n--;
      continue;
    }
    else {
      match = false;
      break;
    }
  }

  return match;
}


int CatStk::size() {
return _stk.size();
}






