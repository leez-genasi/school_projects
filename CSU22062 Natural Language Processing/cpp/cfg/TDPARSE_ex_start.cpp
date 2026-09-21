#include "TDPARSE.h"
#include <iostream>

TDPARSE::TDPARSE(string grammar){
  /* make a grammar */
  g = Grammar(grammar);
  /* set progress to 0 */
  progress = 0;
  stack_debug = 1;
}

TDPARSE::TDPARSE(){}

/*! displays remaining words and current stack unless stack_debug is 0
 */
void TDPARSE::display_config() {
  if(stack_debug == 1) {
    cout << "WORDS: ";
    for(unsigned int i = progress; i < input.size(); i++) {
      cout << input[i] + " ";
    }
    cout << " STACK: ";
    stk.print();
  }
}

/*! resets stk and progress to initial values for a fresh top-down parse 
 *  so stk set to contain just initial category
 */
void TDPARSE::initialize() {
  /* empty the stack */
  while(stk.is_empty() != 1) {
    stk.pop();
  }
  /* push initial category */
  stk.push(g.initial);

  progress = 0;
  rulecount = 0;
}

/*! returns true if key can be parsed
 */
bool TDPARSE::accept(vector<string> key) {

  initialize();
  input = key;
  display_config();

  Rule r; // will be used in the left expansion case
  int move_type = 0; // classifies whether and what kind of a move can
                     // be made

  while((move_type = move()) != 0) {
    if(move_type == 1) { // LEAF CANCELLATION
      /* PARTIAL should make appropriate to stk & progress */
      /* FIX FROM HERE */
      
      stk.pop();
      
      /* TO HERE */
      
      display_config();
    }
    else if(move_type == 2) { // LEFT EXPANSION
      /* PARTIAL should make appropriate to stk & progress */
      /* FIX FROM HERE */
      
      stk.pop();

      /* TO HERE */
      
      display_config();
    }
  }

  return final_config();

}


/*! returns 0 if no move can be made
 *
 * returns  1 if leaf cancellation using a rule C --> [w]
 *
 * returns  2 left expansion 
 *
 * rules searched linearly looking for leaf cancel or left expansion with 
 * search always from 0
 *
 * when left expansion is applied, rulecount records which rule  
 */
int TDPARSE::move() {
  Rule r;

  if (stk.is_empty() || progress == input.size()) {
    return 0;
  }

  // !! note loops starts from 0 !! //
  for(unsigned int j = 0; j < g.nrules; j++) {
    r = g.rules[j];
    if (are_equal(stk.top(),r.mother)) { // stack is x ..., r is x --> ...
      /* CHECK FOR LEAF CANCELLATION */
      if (r.dtrs.size() == 1 && r.dtrs[0].terminal) { // ie. x --> [smthg]
	if (r.dtrs[0].cat == input[progress]) { // ie. smthg is current word
	  return 1; /* WILL DO LEAF CANCELLATION */
	}
	else {
	  continue; /* ie. ignore x --> [smthg] */
	}
      }
      else { 
	rulecount = j;
	return 2; /* WILL DO LEFT EXPANSION */
      }
    }
  }
  // reach here if none of the rules permit a leaf-cancel
  // or left expansion
  return 0;

}

/*! tests if parser reached state which indicates acceptance
 *  so all input used up and stack reduced to empty 
 */
bool TDPARSE::final_config() {
  if (progress == input.size() && stk.is_empty()) {
    return true;
  }
  else {
    return false;
  }
}
