    if loading_error:
        def list_tostring(input_list):
            return '   '.join(input_list)
        party_result = os.getcwd()+' loaded '+str(num_loaded)+'  '+list_tostring(os.listdir())
    else: