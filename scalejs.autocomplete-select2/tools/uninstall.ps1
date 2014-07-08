param($installPath, $toolsPath, $package, $project)

$project |
	Remove-Paths 'scalejs.autocomplete-select2, select2' |
	Remove-Shims 'select2' |
	Remove-ScalejsExtension 'scalejs.autocomplete-select2' |
	Out-Null
