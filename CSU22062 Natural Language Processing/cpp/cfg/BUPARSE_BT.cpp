#include "BUPARSE_BT.h"
#include <iostream>


BUPARSE_BT::BUPARSE_BT(string grammar): BUPARSE(grammar) {
backtrack_debug = 1;
 stk.print_top_at_left = false;
}

BUPARSE_BT::BUPARSE_BT(){
 stk.print_top_at_left = false;
};


void BUPARSE_BT::initialize_bt(){
 history.clear();
}

void BUPARSE_BT::display_config_bt(){
  int i;
  if (backtrack_debug == 1){
    i = history.size()-1;
    cout << "BACKTRACKING to use of rule: ";
    g.rules[history[i].rulecount].print();

    cout << i << " STACK: "; 
    history[i].stk.print();

    cout << " WORDS: ";
    for(unsigned int j = history[i].progress; j < input.size(); j++) {
      cout << input[j] << ' ';
    }
    cout << endl;
  }
}

// this version shows the whole history instead of just the most recent
 // void BUPARSE_BT::display_config_bt(){

 //   if (backtrack_debug == 1){
 //     cout << "BACKTRACKING\n";
 //     cout << "HISTORY CONTENTS\n";
 //     for(unsigned int i = 0; i < history.size(); i++) {
 //       cout << i << " STACK: ";
 //       history[i].stk.print();
 //       cout << " WORDS: ";
 //       for(unsigned int j = history[i].progress; j < input.size(); j++) {
 // 	cout << input[j] << ' ';
 //       }
 //       cout << " use of rule :";
 //       g.rules[history[i].rulecount].print();
 //     }
 //   }
 // }


bool BUPARSE_BT::accept(vector<string> key) {

  input = key;
  initialize();
  initialize_bt();
  display_config();

  bool backtracking = true;
  unsigned int move_type = 0;
  bool accept = false;
  Rule r;
  Category c;

  do {
    while ((move_type = move()) != 0) {
      if(move_type == 1) { // REDUCE
	extend_history(rulecount);
	r = g.rules[rulecount];

	for (int j = r.dtrs.size(); j > 0; j--) {
	  stk.pop();
	}  /* pop dtrs */
	stk.push(r.mother); /* push mother */
	rulecount = 0;
	display_config();
      }
      else if (move_type == 2) {
	/* there is no alternative later than shift
	   so there is no point adding this to the history */
	c.cat = input[progress];
	c.terminal = true;
	stk.push(c);
	progress++;
        rulecount = 0;
	display_config();
      }
      else {
	cout << "should never reach this \n";
      }
    } // end of moves loop

    // accept, backtrack or fail
    if (final_config() == true) {
      accept = true;
      break;
    }
    else if (history.size() > 0) {
      display_config_bt();
      rulecount = history[history.size()-1].rulecount + 1;
      stk = history[history.size()-1].stk;
      progress = history[history.size()-1].progress;
      history.pop_back();
      backtracking = true;
    }
    else {
      backtracking = false;
      accept = false;
    }
  } while(backtracking);

  return accept;
}

/*! returns 0 if no move can be made
 * 
 * returns 1 if a reduction can be made
 *
 * returns 2 if a shift can be made
 *
 * rules searched linearly for possibility to reduce starting at
 * current value of rulecount
 *
 * if a reduction can be made, rule choice recorded in rulecount
 */
int BUPARSE_BT::move() {
  Rule r;
  // check for reduction
  for(unsigned int j = rulecount; j < g.nrules; j++) {
	r = g.rules[j];
    
	if (stk.dtrs_match(r.dtrs)) {
        rulecount = j;
        return 1;
	}
  }

  // check for shift
  if(progress < input.size()){
    return 2;
  }

  return 0;

}

/*! a move was made using rule with index rulecount
 *  history is extended with (stk,progress,rulecount)
 */
void BUPARSE_BT::extend_history(unsigned int rulecount) {
  // if using last rule, and can't shift, should not extend history
  if((rulecount == g.rules.size()-1) && (progress == input.size())) {
    return;
  }

  BT_ITEM b;
  b.stk = stk;
  b.progress = progress;
  /* record rule number about to be used */
  b.rulecount = rulecount;
  history.push_back(b);

}











