#include "TDPARSE.h"
#include "BT_ITEM.h"
#include <string>
#include <vector>

using namespace std;

/*! \file
 * backtracking top down parser
 */

#if (!defined TDPARSE_BT_H)
#define TDPARSE_BT_H

//! backtracking top down parser
class TDPARSE_BT : public TDPARSE {
public: 
 TDPARSE_BT(string grammar);
 TDPARSE_BT();
 vector<BT_ITEM> history; //!< records states of the parser for backtracking
 // Grammar g; inheritted
 // CatStk stk; inheritted
 bool accept(vector<string> key); // overrides
 int move(); // overrides
 void extend_history(unsigned int rulecount); //!< extends history if necessary 
 // int progress; inheritted
 // int rulecount; inheritted
 // vector<string> input; inheritted
 // int final_config(void); inheritted
 // void initialize(void); inheritted
 // void display_config(void); inheritted
 // int stack_debug; inheritted
 void initialize_bt(); //!< empties backtrack history  
 void display_config_bt(); //!< displays the state being backtracked to
 int backtrack_debug; //!< if set to 0 display_config_bt displays nothing
};

#endif
