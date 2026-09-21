#include "TDPARSE_BT.h"
#include <iostream>


TDPARSE_BT::TDPARSE_BT(string grammar): TDPARSE(grammar) {
  backtrack_debug = 1;
}

TDPARSE_BT::TDPARSE_BT(){}

void TDPARSE_BT::initialize_bt(){
  history.clear();
}

void TDPARSE_BT::display_config_bt(){
  int i;
  if(backtrack_debug == 1){
    i = history.size()-1;
    // cout << "entire choice points\n";
    // for(int j = 0; j < history.size(); j++) {
    //   cout << j << ":" << "(i:" << history[j].progress;
    //   cout << "STACK: ";  history[j].stk.print();
    //   cout << " rule was ("; g.rules[history[j].rulecount].print(); cout << ")\n";
    // }
    
    cout << "BACKTRACKING to use of rule: ";
    g.rules[history[i].rulecount].print();

    cout << i << " WORDS: ";
    for(unsigned int j = history[i].progress; j < input.size(); j++) {
      cout << input[j] << ' ';
    }
    cout << "STACK: "; 
    history[i].stk.print();
  }
}


bool TDPARSE_BT::accept(vector<string> key) {

  input = key;
  initialize();
  initialize_bt();
  display_config();

  bool backtracking = true;
  unsigned int move_type = 0;
  bool accept = false;
  Rule r;

  do {
    while((move_type = move()) != 0) {
      if(move_type == 1) { // LEAF CANCEL
      r = g.rules[rulecount];
      BT_ITEM c = BT_ITEM();
      c.stk = stk;
      c.progress = progress;
      c.rulecount = rulecount;
      history.push_back(c);
      for (int j = r.dtrs.size(); j > 0; j--) {
        stk.pop();
      }
        progress++;
        display_config();
        rulecount=0;
      }
      else if(move_type == 2) { // LEFT EXPANSION
        r = g.rules[rulecount];
        BT_ITEM c = BT_ITEM();
        c.stk = stk;
        c.progress = progress;
        c.rulecount = rulecount;
        history.push_back(c);
        stk.pop(); 
        for (int j = r.dtrs.size() - 1; j >= 0; j--) {
          stk.push(r.dtrs[j]); 
        }

        rulecount = 0;
        display_config();
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
 *          1 leaf cancellation using a rule C --> [w]
 *          2 left expansion 
 *
 * rules searched linearly looking for leaf cancel or left expansion with 
 * search from current value of rulecount
 *
 * when leaf cancellation or left expansion is applied, rulecount records which rule  
 */
int TDPARSE_BT::move() {
  Rule r;

  if (stk.is_empty() || progress == input.size()) {
    return 0;
  }

  // !! note loop starts from rulecount !! //
  for(unsigned int j = rulecount; j < g.nrules; j++) {
    r = g.rules[j];
    if (are_equal(stk.top(),r.mother)) {
      /* CHECK FOR LEAF CANCELLATION */
      if (r.dtrs.size() == 1 && r.dtrs[0].terminal) {
        if (r.dtrs[0].cat == input[progress]) { 
          rulecount = j; 
          return 1; /* WILL DO LEAF CANCEL */
        }
        else {
          continue;
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

/*! a move was made using rule with index rulecount
 * and simplest version would always extend with (stk,progress,rulecount)
 * this is mildly optimised version which extends if a later rule could  
 * be used
 */
void TDPARSE_BT::extend_history(unsigned int rulecount) {

  Rule rule_used, rule_new;
  bool later = false;
  rule_used = g.rules[rulecount];
  /* check if there are later choices */
  for (unsigned int j = rulecount+1; j < g.nrules; j++) {
    rule_new = g.rules[j];
    /* new rule has same mother as rule used */
    if (rule_new.mother.cat == rule_used.mother.cat) {
      /* if new and used rule are terminal, ignore */
      if ((rule_used.dtrs.size() == 1) && (rule_used.dtrs[0].terminal)
	  && (rule_new.dtrs.size() == 1) && (rule_new.dtrs[0].terminal)) {}
      else {
	later = true;
	break;
      }
    }
  }
  
  if(later) {

    /* PARTIAL */
    /* make an appropriate BT_ITEM object and add to history */

  }
}



