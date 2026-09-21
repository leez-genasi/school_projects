#include "CatStk.h"
#include <string>
#include <vector>

using namespace std;

/*! \file 
 * top down parser
 */

#if !(defined TDPARSE_H)
#define TDPARSE_H

//! deterministic top down parser
class TDPARSE {
public: 
 TDPARSE(string grammar);
 TDPARSE();
 Grammar g; //!< the grammar to refer to
 CatStk stk; //!< the stack of Categories
 bool accept(vector<string> key); //!< 
 int move(); //!< returns non-zero when a move can be made
 unsigned int progress; //!< records how far thru input so far 
 unsigned int rulecount; //!< records which rule is being used in a left expansion
 vector<string> input; //!< stores whatever was passed to accept
 bool final_config(); //!< checks whether stk and progress represent an acceptable final configuration
 void initialize(); //!< resets for a fresh call to accept
 void display_config(); //!< shows progress through input and current stk
 int stack_debug; //!< if set to 0 display_config does nothing
};

#endif
