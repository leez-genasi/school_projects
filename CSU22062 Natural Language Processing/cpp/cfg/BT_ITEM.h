#include "CatStk.h"

#if !defined BT_ITEM_h
#define BT_ITEM_h

//! stores state of a parser just before a move is made
class BT_ITEM {
 public:
  BT_ITEM(void);
  CatStk stk; //!< the stack of a parser just before a move is made
  unsigned int rulecount; //!< which rule is about to be used 
  unsigned int progress; //!< progess thru the input just before move is made

};

#endif
