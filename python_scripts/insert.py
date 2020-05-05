### Script used to generate INSERT statements in Oracle.

import argparse
import pandas as pd
import numpy as np
import json


#command for Media
#python3 insert.py --csv movies_metadata.csv --table Media --col title=title:s language=original_language:s release_date=release_date:date avg_rating=vote_average:d image_url=*http://image.tmdb.org/t/p/w185+poster_path:s --custom media_type=M:s --id media_id --keyword_by_csv keywords keywords.csv 

parser = argparse.ArgumentParser(description='Creating a text file of DDL insert statements into a table from csv file')

parser.add_argument('--csv', dest='csv_path', help='path to csv file', required=True)
parser.add_argument('--table', dest='table_name', help='name of table', required=True)
parser.add_argument('--col', nargs='+', dest='list_of_cols', help='list of columns in the csv we want to include. Supports concatenation by adding value with *. Indicate datatype with :s for string, :d for number, :date for date. \n Ex:[--col table_col=csv_col:d]\nOR [--col table_col=*value+csv_col:s', required=True)
parser.add_argument('--custom', nargs='+', dest='custom_cols', help='list of columns we want to include in order.\nEx:[--custom col_name in table=custom_value]')
parser.add_argument('--id', dest='id', help='flag if we want id_num generation, specify name and id_num to start from.\nEx:[--id media_id=32]\nOR [--id media_id] default value starts from 0')
parser.add_argument('--keyword_by_csv', nargs=2, dest='keyword_arg', help='specify name of field and keyword csv file to add keyword parameter.\nEx:[--keyword_by_csv media_keywords keyword.csv ]')
args = parser.parse_args()

csv_path = args.csv_path
table = args.table_name

table_cols = [col.split("=")[0] for col in args.list_of_cols] 
csv_cols = [col.split("=")[1] for col in args.list_of_cols] 
 
#check for concatenations
i = 0
concatenations = []
for col in csv_cols:
    if len(col.split("+")) > 1:
        val1, val2 = col.split("+")
        if val1.startswith("*"):
            csv_cols[i] = val2
            concatenations.append((True, val1.strip("*")))
        else:
            inFront = False
            concat_value = val2.strip("*")
            csv_cols[i] = val1
            concatenations.append((False, val2.strip("*")))
    else:
        concatenations.append(None)

    i = i + 1

#check for datatype
i = 0
datatypes = [col.split(":")[1] for col in csv_cols] 
csv_cols = [col.split(":")[0] for col in csv_cols]

#include id generation if specified
include_id = False
if args.id is not None:
    id_name = args.id.split("=")[0]
    table_cols = [id_name] + table_cols
    include_id = True

    starting_id = 0
    if (len(args.id.split("=")) > 1):
        starting_id = int(args.id.split("=")[1])

#include custom cols if specified
include_custom_cols = False
if args.custom_cols is not None:  
    include_custom_cols = True 
    table_cols = table_cols + [col.split("=")[0] for col in args.custom_cols]
    custom_datatypes = [col.split(":")[1] for col in args.custom_cols]
    custom_values = [col.split("=")[1] for col in args.custom_cols]
    custom_values = [col.split(":")[0] for col in custom_values]

    i = 0 
    for val in custom_values:
        if (custom_datatypes[i] == 's') :
            custom_values[i] = "\'" + str(val) + "\'"
        i = i + 1

#handle keywords
include_keywords = False

def proper_json_format(input_string):
    input_string = input_string.replace("\"", "\'")
    input_string = input_string.replace("{'", "{\"")
    input_string = input_string.replace("':", "\":")
    input_string = input_string.replace("'}", "\"}")
    input_string = input_string.replace(": '", ": \"")
    input_string = input_string.replace(", '", ", \"")
    input_string = input_string.replace("\\xa0", "")
    return input_string

def oracle_format(input_string):
    #replace "'" with "''"
    input_string =input_string.replace("'", "''")
    #replace ampersand with '||'&'||'
    input_string = input_string.replace("&", "'||'&'||'")
    return input_string

if args.keyword_arg is not None:
    keyword_csv = args.keyword_arg[1]
    keyword_col_name = args.keyword_arg[0]
    include_keywords = True
    keyword_df = pd.read_csv(keyword_csv, usecols=['id', 'keywords'])
    keywords_json_list = keyword_df.keywords.to_list()
    keywords_json_list1 = keyword_df.id.to_list()
    
    keyword_values = []
    for keyword_json in keywords_json_list :
        #replace single quotes with double quotes 
        keyword_json = proper_json_format(keyword_json)

        keywords_dict = json.loads(keyword_json)
        #build strings of keyword1-keyword2-...
        keywords = [entry["name"] for entry in keywords_dict]
        keywords_string = ", ".join(keywords)

        keywords_string = oracle_format(keywords_string)
        keyword_values.append("\'" + keywords_string + "\'")

    table_cols.append(keyword_col_name)

#generate list of values in the format (value1, value2, ...)
def parenthesis(list_of_values): 
    i = 0
    line = "("
    for val in list_of_values:
        line = line + str(val)
        if (i < len(list_of_values) - 1):
            line = line + ", "
        i = i + 1
    line = line + ")"
    return line

#create text file to write to
ddl_file = open("DDL_Statements_Into_" + table + ".txt", "w") 

#create dataframe with specified columns
df = pd.read_csv(csv_path, usecols=csv_cols)

start = 0
end = start
j = 0
for index, row in df.iterrows():
    j = j + 1
    values = []
    if include_id:
        values = [starting_id] 
        starting_id = starting_id + 1
    
    csv_vals = [row[col] for col in csv_cols]

    #add concatenations
    i = 0
    for val in csv_vals:
        if (concatenations[i] is not None and str(val) != "nan"):
            in_front, concat_val = concatenations[i]
            if (in_front):
                csv_vals[i] = str(concat_val) + str(val)
            else:
                csv_vals[i] = str(val) + str(concat_val)
        elif str(val) == "nan":
            csv_vals[i] = "NULL"
        i = i + 1
    
    #replace single quotes with "''"
    csv_vals = [oracle_format(str(val)) for val in csv_vals]

    i = 0
    for val in csv_vals:

        if (val != "NULL"):
            #surround strings with quotes
            if (datatypes[i] == 's') :
                csv_vals[i] = "\'" + str(val) + "\'"
            if (datatypes[i] == 'date') :
                csv_vals[i] = "date \'" + str(val) + "\'"
        i = i + 1

    #replace "'" with "\'"
    values = values + csv_vals

    if include_custom_cols:
        values = values + custom_values

    if include_keywords:
        values.append(keyword_values[j - 1])
    
   
    if (True):
        end = end + 1
        value_line = "  " + parenthesis(values) + ";\n"

        #write beginning lines
        ddl_file.write("INSERT INTO " + table + "\n")
        second_line = parenthesis(table_cols)
        ddl_file.write("  " + second_line + "\n")
        ddl_file.write("VALUES \n")
        ddl_file.write(value_line + "\n")
    
ddl_file.close()

num_entries_inserted = end-start
print("Generated " + str(num_entries_inserted) + " rows")
if (include_id):
    print("Last id used: " + str(starting_id - 1))

     
    