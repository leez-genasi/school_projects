#include "CatStk.h"
#include <string>
#include <vector>

/*! \file
 * class represent a bottom-up shift/reduce parser
 */

using namespace std;

#if !(defined BUPARSE_H) 
#define BUPARSE_H

//! deterministic bottom-up shift/reduce parser
class BUPARSE {
public: 
 BUPARSE(string grammar);
 BUPARSE();
 Grammar g; //!< the grammar to refer to
 CatStk stk; //!< the stack of Categories
 bool accept(vector<string> key);
 int move(void); //!< returns non-zero when a move can be made
 unsigned int progress; //!< records how far thru input so far 
 unsigned int rulecount; //!< records which rules used in a reduce 
 vector<string> input; //!< stores whatever was passed to accept
 bool final_config(); //!< checks whether stk and progress represent an acceptable final configuration
 void initialize(); //!< resets for a fresh call to accept
 void display_config(); //!< shows progress through input and current stk
 int stack_debug; //!< if set to 0 display_config does nothing
};

#endif
