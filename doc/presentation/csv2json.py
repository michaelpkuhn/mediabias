def jsontoCSV(json_path, csv_path):
    import json
    import csv
    merged_csv = []
    with open(json_path, encoding='utf-8') as ref:
        data = json.load(ref)
        headers = list(data[0].keys())
        csv_row = []
        for item in data:
            item_ls = []
            for col in headers:
                try:
                    item_ls.append(item[col])
                except:
                    item_ls.append(None)
            csv_row.append(item_ls)
        merged_csv += csv_row
    
    with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
        spamwriter = csv.writer(csvfile)
        for row in merged_csv:
            spamwriter.writerow(row)
