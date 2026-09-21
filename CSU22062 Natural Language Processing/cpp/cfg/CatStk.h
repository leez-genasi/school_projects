/*! \file
 * class for a stack of categories
 */

#include <vector>
#include "rules.h"

using namespace std;

#if !defined CAT_STK_H
#define CAT_STK_H

//! to represent a stack of categories to be used by a parser 
class CatStk {
public:
  CatStk();
  ~CatStk();
  void push(Category c);
  Category pop();
  Category top();
  bool is_empty(); 
  void print();
  bool dtrs_match(vector<Category> dtrs); 
  int size();
  bool print_top_at_left; //!< controls whether printed with top at left (default) or top at right
 private:
  vector<Category> _stk;
};

#endif











